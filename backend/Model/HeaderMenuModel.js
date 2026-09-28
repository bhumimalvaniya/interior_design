import mongoose from "mongoose";

const HeaderMenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["service", "project", "general"],
      default: "general",
    },

    // single = normal clickable menu
    // dropdown = parent menu
    menuType: {
      type: String,
      enum: ["single", "dropdown"],
      default: "single",
    },

    // null = main menu
    // parent menu ID = submenu
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HeaderMenu",
      default: null,
    },

    path: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
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

export default mongoose.model("HeaderMenu", HeaderMenuSchema);