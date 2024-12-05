const mongoose = require("mongoose");
const { Schema } = mongoose;

const TestimonialSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      
    },
    description: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model("Testimonial", TestimonialSchema);
module.exports = Testimonial;
