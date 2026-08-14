import crypto from "crypto";

function hashValue(value) {
    return crypto
        .createHash("sha256")
        .update(value)
        .digest("hex")

};

export default hashValue