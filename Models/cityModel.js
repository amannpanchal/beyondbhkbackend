const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: ["enabled", "disabled"], required: true },
  },
  { timestamps: true } 
);

const City = mongoose.model("City", CitySchema);

module.exports = City;
