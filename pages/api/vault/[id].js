// pages/api/vault/[id].js (PUT method)
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID provided" });
  }

  if (req.method === "PUT") {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { website, username, encryptedPassword, iv, salt, notes } = req.body;

      const updatedVaultItem = await prisma.vaultItem.update({
        where: {
          id: id,
          userId: userId,
        },
        data: {
          website: website,
          username: username,
          encryptedPassword: encryptedPassword,
          iv: iv,
          salt: salt,
          notes: notes,
        },
      });

      res.status(200).json({ message: "Vault item updated successfully" });
    } catch (error) {
      console.error("Error updating vault item:", error);
      res.status(500).json({ error: "Failed to update vault item" });
    } finally {
      await prisma.$disconnect();
    }
  }  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}