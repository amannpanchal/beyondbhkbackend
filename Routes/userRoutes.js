const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  addToCart,
  fetchCartByUser,
  deleteFromCart,
  updateCart,
  addToWishlist,
  getAllWishlist,
  removeFromWishlist,
  getAllPropertyCart,
  removeFromCart,
  orderProperty,
  getAllMyOrders,
  deleteOrder,
  myprofile,
} = require("../Controllers/userController.js");

const { validateUserToken } = require("../middlewares/authMiddleware.js");
router.get("/myprofile", validateUserToken, myprofile);

router.get("/cart",validateUserToken, getAllPropertyCart);
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.post("/cart", validateUserToken, addToCart);
router.delete("/cart/:cartItemId", validateUserToken, removeFromCart);

router.post("/wishlist", validateUserToken, addToWishlist);
router.get("/getMyWishlist/:id", validateUserToken, getAllWishlist);
router.delete("/removeFromWishlist/:wishlistItemId", validateUserToken, removeFromWishlist);

router.post("/order", validateUserToken, orderProperty);
router.get("/getAllMyOrder", validateUserToken, getAllMyOrders);
router.delete("/deleteOrder/:orderId", validateUserToken, deleteOrder);
 
module.exports = router;
  