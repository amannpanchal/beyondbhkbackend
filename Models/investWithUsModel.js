const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvestWithUsSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    whatsappNumber: {
      type: String,
      required: [true, "WhatsApp number is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      match: [/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit pincode"],
    },
    companyFirmName: {
      type: String,
      required: [true, "Company/Firm name is required"],
      trim: true,
    },
    companyFirmAddress: {
      type: String,
      required: [true, "Company/Firm address is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const InvestWithUs = mongoose.model("InvestWithUs", InvestWithUsSchema);
module.exports = InvestWithUs;
