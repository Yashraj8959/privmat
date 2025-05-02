import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) return null;

  try {
    // 1. Try finding user by Clerk ID
    let loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) return loggedInUser;

    // 2. Create user if not found
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
    const email = user.emailAddresses[0]?.emailAddress ?? "";

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        email,
        // imageUrl: user.imageUrl, // Optional if included in your schema
      },
    });

    console.log("✅ Created new user in DB:", newUser.id);
    return newUser;
  } catch (error) {
    console.error("❌ Failed to find or create user:", error);
    return null;
  }
};
