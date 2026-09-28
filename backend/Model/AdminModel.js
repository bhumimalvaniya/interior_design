
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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

    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Blocked"],
      default: "Active",
    },

    role: {
      type: String,
      default: "Admin",
    },
    phone: {
  type: String,
  required: true,
  unique: true,
  trim: true,
},
    // ========================================== 
    // FORGOT PASSWORD //
    //  ========================================== 
    resetOtp: 
    { 
        type: String, 
        default: null,
     }, 
     resetOtpExpire:
      { 
        type: Date, 
        default: null, 
    }, 
    resetOtpVerified:
     { 
        type: Boolean,
         default: false,
         },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;

