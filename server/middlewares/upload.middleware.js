import multer from "multer";
import path from "path";
import fs from "fs/promises"

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await fs.mkdir("./uploads", { recursive: true });
        cb(null, "./uploads");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, //  10 MB
    },
});

export const uploadImages = upload.fields([
    { name: "profileImage", maxCount: 5 },
    { name: "aadhaarFront", maxCount: 5 },
    { name: "aadhaarBack", maxCount: 5 },
]);

export const uploadRoomImage = upload.array(
    "roomImage",
    6
);