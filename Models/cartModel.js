 const mongoose = require("mongoose");
 const { Schema } = mongoose;

 const cartSchema = new Schema({
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true }, 
   user: { type: Schema.Types.ObjectId, ref: "User", required: true },
 });

 const Cart = mongoose.model("Cart", cartSchema);
 module.exports = Cart;
