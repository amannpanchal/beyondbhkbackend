const User = require("../Models/userModel.js");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../Utils/jwt.js");
const {
  successResponse,
  errorResponse,
  internalServerError,
  notFoundError,
  validationError,
  badRequestError,
  conflictError,
} = require("../Utils/resHandler.js");
const asynchandler = require("express-async-handler");
const Cart = require("../Models/cartModel.js")
const Property = require("../Models/propertyModel.js");
const Wishlist = require("../Models/wishlistModel.js");
const { default: mongoose } = require("mongoose");
const Order = require("../Models/orderModel.js");

// Create a new user
const createUser = asynchandler(async (req, res) => {
    const { firstName, lastName, email, phone, password, role } = req.body;

    try {
      if (!firstName || !lastName || !email || !phone || !password) {
        return validationError(res, "All fields are required");
      }

       
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return validationError(
          res,
          "User with this email or phone already exists"
        );
      }

       
      const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        password, 
        role,
      });

       
      await newUser.save();
      return successResponse(res, newUser, "User created successfully");
    } catch (error) {
       if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val) => val.message);
        return validationError(res, messages.join(", "));
      }

       
      return serverError(res, "An error occurred while creating the user");
    }
});

// User login
 const loginUser = asynchandler(async (req, res) => {
   const { email, password } = req.body;

   try {
      const user = await User.findOne({ email });
     if (!user) {
       return errorResponse(res, "Invalid email or password", 401);
     }

      const isMatch = await user.comparePassword(password);
     if (!isMatch) {
       return errorResponse(res, "Invalid email or password", 401);
     }

      const token = user.getJWTToken();

      return successResponse(
       res,
       {
         token,
         user,
       },
       "Login successful"
     );
   } catch (error) {
      return internalServerError(res, error.message);
   }
 });

// Get all users
const getUsers = asynchandler(async (req, res) => {
  try {
    const users = await User.find();
    return successResponse(res, users, "Users retrieved successfully");
  } catch (error) {
    return internalServerError(res, error.message);
  }
});

// Get a single user by ID
const getUserById = asynchandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return notFoundError(res, "User not found");
    return successResponse(res, user, "User retrieved successfully");
  } catch (error) {
    return internalServerError(res, error.message);
  }
});
const myprofile = asynchandler(async (req, res) => {
  try {
   
    const user = await User.findById(req?.user?._id);
    if (!user) return notFoundError(res, "User not found");
    return successResponse(res, user, "User retrieved successfully");
  } catch (error) {
    return internalServerError(res, error.message);
  }
});

// Update a user
const updateUser = asynchandler(async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, isAdmin } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return notFoundError(res, "User not found");

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (isAdmin !== undefined) user.isAdmin = isAdmin;

    await user.save();
    return successResponse(res, user, "User updated successfully");
  } catch (error) {
    return validationError(res, error.message);
  }
});

 const deleteUser = asynchandler(async (req, res) => {
   try {
     const user = await User.findById(req.params.id);

     if (!user) {
       return notFoundError(res, "User not found");
     }
     await User.deleteOne({ _id: req.params.id });

     return successResponse(res, null, "User deleted successfully");
   } catch (error) {
     console.error(error);
     return internalServerError(
       res,
       "An error occurred while deleting the user"
     );
   }
 });

const addToCart = asynchandler(async (req, res) => {
     const userId = req.user._id; 
  const { propertyId } = req.body;

     try {
   
       const property = await Property.findById(propertyId);
       if (!property) {
         return res.status(404).json({ message: "Property not found" });
       }

       const user = await User.findById(userId);
       if (!user) {
         return res.status(404).json({ message: "User not found" });
       }

      
       user.wishlist.push(property._id);

       await user.save();
       
       console.log(user?.wishlist)

       // Return a success response with the newly added cart item
       return res
         .status(201)
         .json({ message: "Item added to cart", cartItem: propertyId });
     } catch (error) {
       console.error("Error in addToCart:", error); // Log error for debugging
       return res.status(500).json({ message: "Server error", error });
     }
});

 
 
 const removeFromCart = asynchandler(async (req, res) => {
    const { cartItemId } = req.params; // Get cart item ID from the request parameters
    const userId = req.user.id; // Get the authenticated user's ID from the token

    try {
      // Attempt to delete the cart item based on the ID and user ID
      const deletedCartItem = await Cart.findOneAndDelete({
        _id: cartItemId,
        user: userId,
      });

      // If the cart item was not found, return a 404 error
      if (!deletedCartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      // Update the user's cart by removing the cart item reference
      const user = await User.findById(userId);
      if (user) {
        user.cart = user.cart.filter((item) => item.toString() !== cartItemId);
        await user.save();
      }

      // Return a success response
      return res
        .status(200)
        .json({ message: "Item removed from cart", cartItemId });
    } catch (error) {
      console.error("Error in removeFromCart:", error); // Log error for debugging
      return res.status(500).json({ message: "Server error", error });
    }
 });

const getAllPropertyCart = asynchandler(async (req, res) => {
  
   const  userId  = req.user?._id;

  try {
    const user = await User.findById(userId).populate("wishlist")
    console.log(user,'ewr')
     console.log(user?.wishlist)
     if (!user) {
       return res.status(404).json({ message: "User not found" });
     }
     let cartItems = user?.wishlist;
    
     if (cartItems.length === 0) {
       return res.status(404).json({ message: "No items found in cart" });
     }

     return res.status(200).json({ cartItems });
   } catch (error) {
     return res.status(500).json({ message: "Server error", error });
   }
 });



 const addToWishlist = asynchandler(async (req, res) => {
   const { propertyId } = req.body;
   const userId = req.user.id;

   // Validate input
   if (!propertyId) {
     return badRequestError(res, "Property ID is required");
   }

   // Check if the provided propertyId is a valid MongoDB ObjectId
   if (!mongoose.Types.ObjectId.isValid(propertyId)) {
     return badRequestError(res, "Invalid Property ID format");
   }

   try {
     const property = await Property.findById(propertyId);
     if (!property) {
       return notFoundError(res, "Property not found");
     }

     const isInWishlist = await Wishlist.isInWishlist(userId, propertyId);
     if (isInWishlist) {
       return conflictError(res, "Property is already in the wishlist");
     }

     const wishlistItem = new Wishlist({
       property: propertyId,
       user: userId,
     });

     const savedWishlistItem = await wishlistItem.save();

     // Push the wishlist item ID into the user's wishlist array
     await User.findByIdAndUpdate(userId, {
       $push: { wishlist: savedWishlistItem._id },
     });

     const populatedWishlistItem = await Wishlist.findById(
       savedWishlistItem._id
     ).populate("property");

     successResponse(
       res,
       populatedWishlistItem,
       "Property added to wishlist successfully"
     );
   } catch (error) {
     console.error("Error in addToWishlist:", error);
     internalServerError(res, "An error occurred while adding to the wishlist");
   }
 });

   

 // Controller to get all wishlist items for a user
const getAllWishlist = asynchandler(async (req, res) => {
     const userId = req.user.id; // Get the authenticated user's ID from the token
 
     try {
        const wishlistItems = await Wishlist.find({ user: userId }).populate(
         "property"
       );

       // If no wishlist items are found for the user
       if (!wishlistItems.length) {
         return notFoundError(res, "No wishlist items found");
       }

        successResponse(res, wishlistItems, "Wishlist fetched successfully");
     } catch (error) {
       console.error("Error in getAllWishlist:", error);
       internalServerError(
         res,
         "An error occurred while fetching the wishlist"
       );
     }
});


// Controller to remove a property from the wishlist
const removeFromWishlist = asynchandler(async (req, res) => {
    const { wishlistItemId } = req.params; // Get wishlist item ID from route params
    const userId = req.user.id; // Get user ID from the token

    try {
      // Find the wishlist item by its ID
      const wishlistItem = await Wishlist.findById(wishlistItemId);

      // Check if the wishlist item exists
      if (!wishlistItem) {
        return notFoundError(res, "Wishlist item not found");
      }

      // Check if the wishlist item belongs to the logged-in user
      if (wishlistItem.user.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to remove this item" });
      }

      // Remove the wishlist item from the database
      await Wishlist.findByIdAndDelete(wishlistItemId);

      successResponse(res, {}, "Item removed from wishlist successfully");
    } catch (error) {
      console.error("Error in removeFromWishlist:", error);
      internalServerError(
        res,
        "An error occurred while removing the wishlist item"
      );
    }
});


const orderProperty = asynchandler(async (req, res) => {
  try {
    const userId = req.user.id;  
    const { cartId } = req.body;  

    const cart = await Cart.findById(cartId).populate("property");

    if (!cart || cart.user.toString() !== userId) {
      return res
        .status(404)
        .json({ message: "Cart not found or does not belong to the user" });
    }

    const order = new Order({
      cart: cartId,
      user: userId,
    });

    await order.save();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.orders.push(order._id);
    await user.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const getAllMyOrders = asynchandler(async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId }).populate("cart");

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const   deleteOrder = asynchandler(async (req, res) => {
  try {
    const { orderId } = req.params;  
    const userId = req.user.id;  

     const order = await Order.findById(orderId);

    if (!order || order.user.toString() !== userId) {
      return res
        .status(404)
        .json({ message: "Order not found or does not belong to the user" });
    }

     await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


 const addPropertyToTheCart = asynchandler(async (req, res) => {
   try {
     const { propertyId } = req.params;
     const property = await Property.findById(productId);
     if (!property) {
       return res.status(404).json({ message: "Property not found" });
     }
     const userId = req.user._id;
     user.cart.push(propertyId);
     await user.save;
     res.status(200).json({ message: "Property added to cart" });
   } catch (e) {
     res.status(500).json({ message: "Server error", error: e });
   }
 });


const removePropertyFromTheCart = asynchandler(async (req, res) => {
  try {
    const { propertyId } = req.params;

    const userId = req.user._id;

    const user = await User.findById(userId);

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    user.cart.pull(propertyId);
    await user.save();
    res.status(200).json({ message: "Property removed from cart" });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e });
  }
});



const addSoManyItemsToCart = asynchandler(async (req, res) => {
  try {
    const { propertyIds } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const properties = await Property.find({ _id: { $in: propertyIds } });

    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: "Properties not found" });
    }

    properties.forEach((property) => {
      user.cart.push(property._id);
    });

    await user.save();
    res.status(200).json({ message: "Properties added to cart" });
  } catch (e) {
    return res.status;
  }
});




module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addToCart,
  removeFromCart,
  getAllPropertyCart,
  addToWishlist,
  getAllWishlist,
  removeFromWishlist,
  orderProperty,
  getAllMyOrders,
  deleteOrder,
  addPropertyToTheCart,
  myprofile
};
