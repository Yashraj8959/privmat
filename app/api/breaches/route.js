// app/api/breaches/route.js

import { auth } from "@clerk/nextjs/server"; 
import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";
import axios from "axios";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Use auth() from Clerk to get the userId
    const { userId: clerkUserId } = await auth(req);
    console.log("🔐 Clerk auth() in route.js =", clerkUserId);

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Convert Clerk ID to DB userId
    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: clerkUserId },
    });

    if (!dbUser) {
        return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // Get request body data
    const body = await req.json();
    const { email } = body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // --- Call XposedOrNot Breach Analytics API ---
    const apiUrl = `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(email)}`;
    const xposedResponse = await axios.get(apiUrl, {
      validateStatus: function (status) {
        // Allow 404 (Not Found) as a non-error response
        return status >= 200 && status < 300 || status === 404;
      }
    });

    // --- Process the response ---
    if (xposedResponse.status === 404 || xposedResponse.data.Error === "Not found") {
      // No breaches found for this email
      return NextResponse.json({ breaches: [] });
    }

    const responseData = xposedResponse.data;
    let breachesFoundForFrontend = [];

    if (responseData.ExposedBreaches && responseData.ExposedBreaches.breaches_details) {
      for (const breachDetail of responseData.ExposedBreaches.breaches_details) {
        const normalizedName = breachDetail.breach.trim().toLowerCase();

        // 1. Find or Create DataBreach record in your DB
        let dbBreach = await prisma.dataBreach.findUnique({
          where: { name: normalizedName },
        });

        if (!dbBreach) {
          // Attempt to parse the date
          let breachDate = new Date();
          try {
            if (breachDetail.xposed_date && /^\d{4}$/.test(breachDetail.xposed_date)) {
              breachDate = new Date(parseInt(breachDetail.xposed_date, 10), 0, 1); // Set to Jan 1st of that year
            }
          } catch (dateError) {
            console.error(`Error parsing date for breach ${breachDetail.breach}: ${breachDetail.xposed_date}`, dateError);
          }

          try {
            dbBreach = await prisma.dataBreach.create({
              data: {
                name: normalizedName,
                breachDate: breachDate,
                description: breachDetail.details || null,
                dataTypesLeaked: breachDetail.xposed_data || null,
                pwnedCount: breachDetail.xposed_records || null,
              },
            });
          } catch (error) {
            if (error.code === 'P2002') {
              console.warn(`⚠️ Duplicate breach found while creating: ${normalizedName}. Fetching existing one.`);
              dbBreach = await prisma.dataBreach.findUnique({
                where: { name: normalizedName },
              });
            } else {
              throw error;
            }
          }
        }

        console.log("Upserting UserBreach for:", {
          userId: dbUser.id, // Use dbUser.id here, not clerkUserId directly
          dataBreachId: dbBreach.id,
        });

        // 2. Create UserBreach link if it doesn't exist
        const existingBreach = await prisma.userBreach.findUnique({
          where: {
            userId_dataBreachId: {
              userId: dbUser.id, // Use dbUser.id here
              dataBreachId: dbBreach.id,
            },
          },
        });

        let updatedEmails = [];

        if (existingBreach?.emailCompromised) {
          // Safely merge and dedupe
          updatedEmails = Array.from(new Set([
            ...existingBreach.emailCompromised.filter(e => typeof e === 'string'),
            email
          ]));
        } else {
          updatedEmails = [email];
        }

        await prisma.userBreach.upsert({
          where: {
            userId_dataBreachId: {
              userId: dbUser.id, // Use dbUser.id here
              dataBreachId: dbBreach.id,
            },
          },
          update: {
            emailCompromised: updatedEmails,
          },
          create: {
            userId: dbUser.id, // Use dbUser.id here
            dataBreachId: dbBreach.id,
            emailCompromised: updatedEmails,
          },
        });

        // 3. Prepare data for frontend response
        breachesFoundForFrontend.push({
          id: dbBreach.id, // Send the ID for potential linking
          name: breachDetail.breach,
          date: dbBreach.breachDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
          description: dbBreach.description,
          compromisedData: dbBreach.dataTypesLeaked?.split(';') || [], // Split the string
        });
      }
    }

    return NextResponse.json({ breaches: breachesFoundForFrontend });

  } catch (error) {
    console.error("Breach check API error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to check for breaches" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
