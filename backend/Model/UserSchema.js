import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },

    city: {
  type: String,
  default: "",
  trim: true,
},

address: {
  type: String,
  default: "",
  trim: true,
},

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    isblocked: {
      type: Boolean,
      default: false,
    },

    status: {
       type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    // OTP
    otp: {
      type: String,
      default: null,
    },

    otpExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("customers", userSchema);

export default User;