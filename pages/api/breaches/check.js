// pages/api/breaches/check.js

import { getAuth, currentUser} from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma";
import axios from 'axios';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {

    try {
      const { userId: clerkUserId } = getAuth(req);
        console.log("🔐 Clerk middleware: userId in check.js =", clerkUserId);
      if (!clerkUserId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // ✅ Convert Clerk ID to DB userId
        const dbUser = await prisma.user.findUnique({
            where: { clerkUserId: clerkUserId },
        });
  
        if (!dbUser) {
            return res.status(404).json({ error: "User not found in database" });
        }
      const { email } = req.body;
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // --- Call XposedOrNot Breach Analytics API ---
      const apiUrl = `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(email)}`;
      const headers = {};

      const xposedResponse = await axios.get(apiUrl, {
          headers,
          validateStatus: function (status) {
              // Allow 404 (Not Found) as a non-error response
              return status >= 200 && status < 300 || status === 404;
          }
      });

      // --- Process the response ---
      if (xposedResponse.status === 404 || xposedResponse.data.Error === "Not found") {
        // No breaches found for this email
        return res.status(200).json({ breaches: [] });
      }

      // Assuming successful response with breach details
      const responseData = xposedResponse.data;
      let breachesFoundForFrontend = [];

      if (responseData.ExposedBreaches && responseData.ExposedBreaches.breaches_details) {
        for (const breachDetail of responseData.ExposedBreaches.breaches_details) {
            const normalizedName = breachDetail.breach.trim().toLowerCase();

           // 1. Find or Create DataBreach record in your DB
           let dbBreach = await prisma.dataBreach.findUnique({
             where: { name: normalizedName }, // Assuming 'breach' name is unique identifier
           });

           if (!dbBreach) {
              // Attempt to parse the date - needs error handling
              let breachDate = new Date(); // Default to now if parsing fails
              try {
                  // Assuming xposed_date is just the year 'YYYY'
                  if (breachDetail.xposed_date && /^\d{4}$/.test(breachDetail.xposed_date)) {
                      breachDate = new Date(parseInt(breachDetail.xposed_date, 10), 0, 1); // Set to Jan 1st of that year
                  }
                  // Add more robust date parsing if the format is different
              } catch (dateError) {
                  console.error(`Error parsing date for breach ${breachDetail.breach}: ${breachDetail.xposed_date}`, dateError);
              }

              try {
             dbBreach = await prisma.dataBreach.create({
               data: {
                 name: normalizedName,
                 breachDate: breachDate,
                 description: breachDetail.details || null,
                 dataTypesLeaked: breachDetail.xposed_data || null, // Directly use the string if available
                 pwnedCount: breachDetail.xposed_records || null, // Check if field exists/is number
                 // Add other fields as available (e.g., domain, industry) if you add them to your schema
               },
             });
           }catch (error) {
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
            userId: dbUser.id,
            dataBreachId: dbBreach.id
          });
          // Check if UserBreach already exists
const existingBreach = await prisma.userBreach.findUnique({
    where: {
      userId_dataBreachId: {
        userId: dbUser.id,
        dataBreachId: dbBreach.id,
      }
    }
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
 
           // 2. Create UserBreach link if it doesn't exist
           await prisma.userBreach.upsert({
             where: {
               userId_dataBreachId: { // Use the combined unique key
                 userId: dbUser.id,
                 dataBreachId: dbBreach.id,
               }
             },
             update: {
                emailCompromised: updatedEmails,
             }, 
             create: {
               userId: dbUser.id,
               dataBreachId: dbBreach.id,
               emailCompromised: updatedEmails, // Store which email was compromised
             }
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

      res.status(200).json({ breaches: breachesFoundForFrontend });

    } catch (error) {
      console.error("Breach check API error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to check for breaches" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}