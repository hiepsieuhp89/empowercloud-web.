// utils/crypto.ts

import crypto from 'crypto'

// Define the algorithm, key, and initialization vector (IV)
const algorithm = 'aes-256-cbc'

function generateSecretKeyFromPassphrase(): Buffer {
  // Hash the passphrase to generate a 32-byte key
  return crypto
    .createHash('sha256')
    .update(process.env.JWT_SECRET as string)
    .digest()
}

const secretKey = generateSecretKeyFromPassphrase()

// Define types for encrypted data
interface EncryptedData {
  iv: string
  content: string
}

// Function to encrypt data
export function encrypt(
  jsonData: Record<string, string | number>,
): EncryptedData {
  const iv = crypto.randomBytes(16)
  const jsonString = JSON.stringify(jsonData)
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  const encrypted = Buffer.concat([cipher.update(jsonString), cipher.final()])

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  }
}

// Function to decrypt data
export function decrypt(
  encryptedData: EncryptedData,
): Record<string, string | number> {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(encryptedData.iv, 'hex'),
  )

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData.content, 'hex')),
    decipher.final(),
  ])

  return JSON.parse(decrypted.toString())
}
