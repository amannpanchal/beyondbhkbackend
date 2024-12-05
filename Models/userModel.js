require("dotenv").config();
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

 const UserSchema = new mongoose.Schema(
   {
     firstName: { type: String, required: [true, "First name is required"] },
     lastName: { type: String, required: [true, "Last name is required"] },
     email: {
       type: String,
       required: [true, "Please enter your email"],
       unique: true,
       validate: [validator.isEmail, "Please enter a valid email"],
     },
     phone: {
       type: String,
       required: [true, "Please enter your phone number"],
       unique: true,
       validate: [validator.isMobilePhone, "Please enter a valid phone number"],
     },
     password: {
       type: String,
       required: [true, "Please enter your password"],
       minLength: [6, "Password must be at least 6 characters"],
     },
     role: {
       type: String,
       enum: ["admin", "user", "superAdmin"],
       default: "user",
     },
     
     wishlist: [
       {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Property",
       },
     ],

     
     orders: [
      
       {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Order",
       },
     ],
   },
   {
     timestamps: true,
   }
 );


// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with hashed password
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Generate JWT token
UserSchema.methods.getJWTToken = function () {
  if (!process.env.JWTSECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ _id: this._id }, process.env.JWTSECRET, {
    expiresIn: "15 days",
  });
};

module.exports = mongoose.model("User", UserSchema);
