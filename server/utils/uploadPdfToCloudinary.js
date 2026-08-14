import fs from "fs/promises";
import cloudinary from "../config/cloudinary.connect.js";

export const uploadPdfToCloudinary = async (pdfBuffer) => {
    await fs.mkdir("./public/receipts", { recursive: true });

    const pdfPath = `./public/receipts/receipt-${Date.now()}.pdf`;

    await fs.writeFile(pdfPath, pdfBuffer);

    try {
        const result = await cloudinary.uploader.upload(pdfPath, {
            resource_type: "raw",
            folder: "rentflow/receipts",
        });

        return result;
    } finally {
        await fs.unlink(pdfPath).catch(() => { });
    }
};