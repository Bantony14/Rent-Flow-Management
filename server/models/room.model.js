import mongoose from "mongoose";
import User from "./user.model.js";


const roomSchema = mongoose.Schema({
    tenantsId: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        defualt: [],
    },

    room: {
        type: String,
        required: true,
        trim: true,
    },

    rent: {
        type: Number,
        required: true
    },

    buildingName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    ownerName: {
        type: String
    },

    Avaliablity: {
        type: Boolean,
        default: true
    },
    roomImage: {
        type: [
            {
                public_id: String,
                secure_url: String,
            },
        ],
        default: [],
    }
},
    { timestamps: true }
)

const Room = mongoose.model("room", roomSchema)

export default Room