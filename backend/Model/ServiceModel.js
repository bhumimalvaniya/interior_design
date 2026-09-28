
import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      enum: [
        "Living Room",
        "Bedroom",
        "Kitchen",
        "Bathroom",
        "Office",
        "Office Interior",
        "Commercial Interior",
        "Dining Room",
        "Kids Room",
        "Balcony",
        "Other",
      ],
    },

    number: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      required: true,
    },

    subtitle: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    link: {
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

const Services = mongoose.model(
  "services",
  servicesSchema
);

export default Services;

