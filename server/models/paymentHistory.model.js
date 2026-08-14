import mongoose, { mongo } from "mongoose";
import User from "./user.model.js"
const paymentSchema = new mongoose.Schema({
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount: Number,

    paymentId: String,

    orderId: String,

    month: [],

    status: {
        type: String,
        enum: ["success", "Failed", "Pending"]
    },

    paidAt: {
        type: Date,
        default: Date.now
    }
});

const PaymentHistory = mongoose.model("paymentHistory", paymentSchema)

export default PaymentHistory;


