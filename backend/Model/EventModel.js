import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    start_date: {
      type: String,
      required: true,
    },

    end_date: {
      type: String,
      required: true,
    },

    start_time: {
      type: String,
      required: true,
    },

    end_time: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    // Category MongoDB ID
    cate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Category name
    cate_nm: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;