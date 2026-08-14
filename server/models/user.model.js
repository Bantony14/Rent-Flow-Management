import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import hashValue from "../utils/hashValue.js";
import encrypt from "../utils/encrypt.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minLength: [3, "Full name must be more than 10 characters"],
      maxLength: [50, "Full name cannot exceed 50 characters"],
    },

    aadhaarNumber: {
      type: String,
      required: [true, "Adhar number is required"],
      unique: true,
      trim: true,
    },
    hashAadhaar: {
      type: String,
      unique: true,
    },

    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Enter valid mobile number"],
      unique: true,
    },

    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    member: [
      {
        name: {
          type: String,
          required: [true, "Member name is required"],
          trim: true,
          minLength: [3, "Name must be at least 3 characters"],
        },

        dob: {
          type: Date,
          required: [true, "Date of birth is required"],
        },

        aadhaarNumber: {
          type: String,
          required: [true, "Adhar number is required"],
          trim: true,
        },
        hashAadhaar: {
          type: String,
        },
        isActive: {
          type: Boolean,
          default: true,
        },

        profileImage: {
          public_id: {
            type: String,
            default: null,
          },
          secure_url: {
            type: String,
            default: null,
          },
          imageFormat: {
            type: String,
          },
        },

        aadhaarFront: {
          public_id: {
            type: String,
            default: null,
          },
          imageFormat: {
            type: String,
          },
        },

        aadhaarBack: {
          public_id: {
            type: String,
            default: null,
          },
          imageFormat: {
            type: String,
          },
        },
      },
    ],
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
      uppercase: true,
    },
    building: {
      type: String,
      required: [true, "Building name is required"],
    },
    role: {
      type: String,
      default: "USER",
      enum: ["ADMIN", "USER"],
    },

    rentPrice: {
      type: Number,
      default: 5000,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    dueAmount: {
      type: Number,
      default: 0,
    },

    nextRentGeneratedMonth: {
      type: String,
      default: null,
    },

    joiningDate: {
      type: Date,
    },

    leavingDate: {
      type: Date,
    },

    lastRentAmount: {
      type: Number,
      default: null,
    },

    profileImage: {
      public_id: {
        type: String,
        // required: true,
      },
      secure_url: {
        type: String,
        // required: true,
      },
      imageFormat: {
        type: String,
      },
    },

    aadhaarFront: {
      public_id: {
        type: String,
        // required: true,
      },
      imageFormat: {
        type: String,
      },
    },

    aadhaarBack: {
      public_id: {
        type: String,
        // required: true,
      },
      imageFormat: {
        type: String,
      },
    },

    rentHistory: [
      {
        month: { type: String },
        dueAmount: { type: Number },
        paymentStatus: { type: String, enum: ["Paid", "Unpaid"] },
        paidOn: { type: Date, default: "" },
      },
    ],

    properties: [],

    otp: String,
    otpExpiry: Date,
  },

  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.pre("save", async function () {
  if (!this.isModified("aadhaarNumber")) {
    return;
  }
  this.hashAadhaar = await hashValue(this.aadhaarNumber);
  this.aadhaarNumber = await encrypt(this.aadhaarNumber);
});

userSchema.pre("save", async function () {
  for (const member of this.member) {
    if (member.aadhaarNumber && !member.hashAadhaar) {
      member.hashAadhaar = await hashValue(member.aadhaarNumber);
      member.aadhaarNumber = await encrypt(member.aadhaarNumber);
    }
  }
});

userSchema.methods = {
  jwtToken: function () {
    return JWT.sign(
      {
        id: this._id,
        mobileNumber: this.mobileNumber,
        role: this.role,
        email: this.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );
  },

  comparePassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
};

const User = mongoose.model("user", userSchema);

export default User;
