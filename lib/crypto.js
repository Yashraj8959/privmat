import crypto from 'crypto';

// Function to generate a random salt
export function generateSalt(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Function to generate a random initialization vector (IV)
export function generateIv(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

// Function to encrypt data using AES-256-CBC
export function encrypt(data, key, iv) {
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Encryption failed"); // Re-throw the error to be caught by the caller
  }
}

// Function to decrypt data using AES-256-CBC
export function decrypt(encryptedData, key, iv) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    const encryptedText = Buffer.from(encryptedData, 'hex');
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed"); // Re-throw the error to be caught by the caller
  }
}