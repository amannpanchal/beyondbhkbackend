const mongoose = require("mongoose");
const { Schema } = mongoose;

const WishlistSchema = new Schema(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Ensure a user cannot add the same property multiple times
WishlistSchema.index({ property: 1, user: 1 }, { unique: true }); 

// Static method to check if a property is already in the user's wishlist
WishlistSchema.statics.isInWishlist = async function (userId, propertyId) {
  const wishlistItem = await this.findOne({
    user: userId,
    property: propertyId,
  });
  return !!wishlistItem;
};

const Wishlist = mongoose.model("Wishlist", WishlistSchema);
module.exports = Wishlist;
