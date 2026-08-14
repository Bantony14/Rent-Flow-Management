import mongoose from "mongoose";
import User from "./user.model.js";
import PaymentHistory from "./paymentHistory.model.js";

const receiptSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PaymentHistory",
            required: true
        },
        receipt: {
            type: String,
            unique: true,
            required: true
        },
        months: [
            {
                month: String,
                amount: Number
            }
        ],
        totalAmount: {
            type: Number,
            required: true
        },
        paymentMethod: String,

        pdf: {
            public_id: { type: String, default: null },
            secure_url: { type: String, default: null }
        }
    },
    {
        timestamps: true
    }
);

const ReceiptHistory = mongoose.model("receiptHistory", receiptSchema)

export default ReceiptHistory;