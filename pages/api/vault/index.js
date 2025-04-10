import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { generateSalt, generateIv, encrypt, decrypt } from "@/lib/crypto";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { userId:clerkUserId } = getAuth(req);

      if (!clerkUserId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const dbUser = await prisma.user.findUnique({
        where: { clerkUserId },
      });
      
      if (!dbUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const vaultItems = await prisma.vaultItem.findMany({
        where: {
          userId: dbUser.id,
        },
        select: {
          id: true,
          website: true,
          username: true,
          encryptedPassword: true,
          iv: true,
          salt: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
        },
      });
       // Decrypt the password for each vault item
       const decryptedVaultItems = vaultItems.map(item => {
        const decryptedPassword = decrypt(item.encryptedPassword, item.salt, item.iv);
        return {
          ...item,
          encryptedPassword: decryptedPassword, // Replace encrypted password with decrypted one
        };
      });

      res.status(200).json(decryptedVaultItems);
    } catch (error) {
      console.error("Error fetching vault items:", error);
      res.status(500).json({ error: "Failed to fetch vault items" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "POST") {
    try {
      const { userId:clerkUserId } = getAuth(req);

      if (!clerkUserId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const dbUser = await prisma.user.findUnique({
        where: { clerkUserId },
      });
      if (!dbUser) {
        return res.status(404).json({ error: "User not found in DB" });
      }
      const { website, username, password, notes } = req.body;
           // Generate random key and iv
           const key = generateSalt(32);
           const iv = generateIv(16);
  
          // Encrypt the password before storing
            const encryptedPassword = encrypt(password, key, iv);

      const vaultItem = await prisma.vaultItem.create({
        data: {
          userId: dbUser.id,
          website: website,
          username: username,
          encryptedPassword: encryptedPassword,
          iv: iv,
          salt: key,
          notes: notes,
        },
      });

      res.status(201).json({ message: "Vault item created successfully" });
    } catch (error) {
      console.error("Error creating vault item:", error);
      res.status(500).json({ error: "Failed to create vault item" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}