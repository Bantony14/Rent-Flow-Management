import crypto from "crypto";
import { config } from "dotenv";
config();

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

function decrypt(encryptedText) {
    const [ivHex, encrypted] = encryptedText.split(":");

    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        iv
    );

    let decrypted = decipher.update(
        encrypted,
        "hex",
        "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
}

export default decrypt;