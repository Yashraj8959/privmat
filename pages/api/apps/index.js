// pages/api/apps/index.js

import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // --- GET Request Logic (from previous step) ---
  if (req.method === 'GET') {
    let dbUserId = null;
    try {
        // --- 1. Authenticate and Ensure User Exists in DB ---

      const { userId: clerkUserId } = getAuth(req);
            if (!clerkUserId) {
              return res.status(401).json({ error: "Unauthorized" });
            }
      
            // ✅ Convert Clerk ID to DB userId
              const dbUser = await prisma.user.findUnique({
                  where: { clerkUserId: clerkUserId },
              });
        
              if (!dbUser) {
                  return res.status(404).json({ error: "User synchronization failed" });
              }
                dbUserId = dbUser.id;


      const userApps = await prisma.userApp.findMany({
        where: { userId: dbUserId },
        include: { app: true },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(userApps);

    } catch (error) {
      console.error("GET /api/apps Error:", error);
      res.status(500).json({ error: "Failed to fetch tracked apps" });
    } finally {
      if (prisma) await prisma.$disconnect();
    }

  // --- POST Request Logic ---
  } else if (req.method === 'POST') {
    let dbUserId = null;
    try {
      // --- 1. Authenticate and Ensure User Exists in DB ---
      const { userId: clerkUserId } = getAuth(req);
      if (!clerkUserId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: clerkUserId },
    });

    if (!dbUser) {
        return res.status(404).json({ error: "User synchronization failed" });
    }
      dbUserId = dbUser.id;

      // --- 2. Get Data from Request Body ---
      const { name, url, emailUsed, phoneUsed, locationAccess, notes } = req.body;

      // Basic validation
      if (!name) {
        return res.status(400).json({ error: "App name is required" });
      }
      const normalizedUrl = url || null; // Treat empty string or undefined as null

      // --- 3. Find Existing App or Create New One ---
    let app = await prisma.app.findFirst({
        where: {
          name: name,
          url: normalizedUrl, // Match both name and URL

          // Optionally add URL to the condition if you want name+url uniqueness
          // url: url || null,
        },
      });
      
      if (!app) {
        // App doesn't exist, create it
        app = await prisma.app.create({
          data: {
            name: name,
            url: normalizedUrl, // Use the normalized URL
          },
        });
        console.log(`Created new App record: ID ${app.id}, Name: ${name}, URL: ${normalizedUrl}`);
      } else {
         console.log(`Found existing App record: ID ${app.id}, Name: ${name}, URL: ${normalizedUrl}`);
      }
      // Now 'app' holds the ID of either the found or newly created app

      // --- 4. Check if UserApp link already exists ---
      const existingUserApp = await prisma.userApp.findUnique({
          where: {
              userId_appId: { // Use the compound unique key
                  userId: dbUserId,
                  appId: app.id,
              }
          }
      });

      if (existingUserApp) {
          return res.status(409).json({ error: "You are already tracking this app." }); // 409 Conflict
      }

      // --- 5. Create the UserApp link ---
      const newUserApp = await prisma.userApp.create({
        data: {
          userId: dbUserId,
          appId: app.id, // Link to the found or created App
          emailUsed: emailUsed || null,
          phoneUsed: phoneUsed || null,
          locationAccess: locationAccess || false,
          notes: notes || null,
        },
        include: { // Include the app details in the response
          app: true,
        }
      });

      // --- 6. Return Success Response ---
      res.status(201).json(newUserApp); // Return the newly created UserApp object

    } catch (error) {
       // Handle potential unique constraint violation if upsert fails unexpectedly
      if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
         // This case might happen if names aren't truly unique and upsert logic needs refinement
         console.error("POST /api/apps: App name conflict potentially not handled by upsert.", error);
         return res.status(409).json({ error: "Conflict creating or finding app." });
      }
      console.error("POST /api/apps Error:", error);
      res.status(500).json({ error: "Failed to track app" });
    } finally {
      if (prisma) {
        await prisma.$disconnect();
      }
    }

  } else {
    // Handle other methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}