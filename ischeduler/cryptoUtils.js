import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
const algorithm = process.env.algorithm;

const SECRET_KEY = crypto
    .createHash(process.env.hash_key)
    .update(process.env.SECRET_KEY)
    .digest();

export function encrypt(text) {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        algorithm,
        SECRET_KEY,
        iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(encryptedText) {
    const [ivHex, encrypted] = encryptedText.split(":");

    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(
        algorithm,
        SECRET_KEY,
        iv
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}