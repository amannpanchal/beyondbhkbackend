const mongoose = require("mongoose");

const PropertyTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: {
      type: String,
      required: true,
    },
    enum: {
      type: String,
      required: true,
      enum: ["Plot","Flat" ,"Duplex" ,'Bungalow/Villa',"Land", "Shop/Commercial"],
    },
  },
  { timestamps: true }
); 

const PropertyType = mongoose.model("PropertyType", PropertyTypeSchema);

module.exports = PropertyType;
