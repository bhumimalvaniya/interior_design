import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      default: "10+",
      trim: true,
    },

    projects: {
      type: String,
      default: "500+",
      trim: true,
    },

    clients: {
      type: String,
      default: "300+",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    cloudinary_id: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const AboutModel = mongoose.model("About", aboutSchema);

export default AboutModel;