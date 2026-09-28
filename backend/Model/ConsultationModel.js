import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    consultationType: {
      type: String,
      required: true,
    },

    preferredDate: {
      type: String,
      required: true,
    },

    preferredTime: {
      type: String,
      required: true,
    },

    budget: {
      type: String,
      default: "",
    },

        avatar: {
        type: String,
         default: "/uploads/default.jpg",
        },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Consultation = mongoose.model(
  "Consultation",
  consultationSchema
);

export default Consultation;