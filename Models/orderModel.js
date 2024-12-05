const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    cart: { type: Schema.Types.ObjectId, ref: "Cart", required: true }, // Reference to the Cart model
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  },
  {
    timestamps: true,  
  }
);

const Order = mongoose.model("Order", orderSchema);  
module.exports = Order;
