import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.User.findFirst({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.User.create({
      data: {
        clerkUserId: user.id,
        name,
        // imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    console.log("Creating new user with ID:", user.id);

    return newUser;
  } catch (error) {
    console.error("Failed to create user:", error);
    return null;
  }
};