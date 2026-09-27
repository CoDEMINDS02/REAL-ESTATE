const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    type: {
      type: String,
      enum: ["house", "apartment", "plot", "commercial", "villa"],
      required: true,
    },
    status: { type: String, enum: ["sale", "rent"], default: "sale" },
    location: {
      address: String,
      city: { type: String, required: true },
      area: String,
      lat: Number,
      lng: Number,
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    areaSqft: { type: Number },
    images: [{ url: String, publicId: String }],
    featured: { type: Boolean, default: false },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amenities: [String],
  },
  { timestamps: true }
);

propertySchema.index({ title: "text", "location.city": "text", "location.area": "text" });

module.exports = mongoose.model("Property", propertySchema);
