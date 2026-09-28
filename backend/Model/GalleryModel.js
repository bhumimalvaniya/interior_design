import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    cloudinary_id: {
      type: String,
      required: false,
      default:"",
    },
  },
  {
    timestamps: true,
    // collection:"galleries",
  }
);

const Gallary = mongoose.model("Gallary", gallerySchema);

export default Gallary;