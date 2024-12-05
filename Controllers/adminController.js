const User = require("../Models/userModel");
const asynchandler = require("express-async-handler");
const cloudinary = require("../Utils/cloudinary.js");
const {
  successResponse,
  errorResponse,
  internalServerError,
  notFoundError,
  validationError,
} = require("../Utils/resHandler");
const fs = require("fs");
const City = require("../Models/cityModel.js");
const Wishlist = require("../Models/wishlistModel.js");
const Testimonial = require("../Models/Testimonials.js");
const Order = require("../Models/orderModel.js");
const Cart = require("../Models/cartModel.js");
const Category = require("../Models/categoryModel.js");

// Admin login functionality
const loginAdmin = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin user exists with the given email
    const user = await User.findOne({ email, role: "admin" });
    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Generate JWT token
    const token = user.getJWTToken();

    // Return success response with token and user information
    return successResponse(
      res,
      {
        token,
        user,
      },
      "Admin login successful"
    );
  } catch (error) {
    return internalServerError(res, error.message);
  }
});

// Get all users (Admin-only route)
const getAllUsers = asynchandler(async (req, res) => {
  try {
    // Fetch all users except the current admin making the request
    const users = await User.find();

    if (!users || users.length === 0) {
      return errorResponse(res, "No users found", 404);
    }

    return successResponse(res, { users }, "Users fetched successfully");
  } catch (error) {
    return internalServerError(res, error.message);
  }
});

// Delete a user by ID (Admin-only route)
const deleteUser = asynchandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID and delete
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, {}, "User deleted successfully");
  } catch (error) {
    return internalServerError(res, error.message);
  }
});

 
const getAllCategory = asynchandler(async (req, res) => {
  try {
    const categories = await Category.find();
    successResponse(res, categories, "Categories retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message || "Server Error", 500);
  }
});

// Create a new category
const createCategory = asynchandler(async (req, res) => {
   try {
     const { name, slug } = req.body;

      if (!name || !slug) {
       return errorResponse(res, "Name and slug are required", 400);
     }
      let image;
     if (req.file) {
       const result = await cloudinary.uploader.upload(req.file.path);
       image = result.secure_url;
     } else {
       return errorResponse(res, "Image file is required", 400);
     }

      const newCategory = new Category({ name, slug, image });
     const savedCategory = await newCategory.save();

      fs.unlinkSync(req.file.path);

      successResponse(res, savedCategory, "Category created successfully");
   } catch (error) {
      return errorResponse(res, error.message || "Server Error", 500);
   }
})

 const deleteCategory = asynchandler(async (req, res) => {
   try {
     const { id } = req.params;

     // Validate category ID
     if (!id) {
       return errorResponse(res, "Category ID is required", 400);
     }

     const deletedCategory = await Category.findByIdAndDelete(id);

     if (!deletedCategory) {
       return errorResponse(res, "Category not found", 404);
     }

     successResponse(res, deletedCategory, "Category deleted successfully");
   } catch (error) {
     return errorResponse(res, error.message || "Server Error", 500);
   }
 });

 const updateCategory = asynchandler(async (req, res) => {
   try {
     const { id } = req.params;
     const { name, slug } = req.body;

      if (!id) {
       return errorResponse(res, "Category ID is required", 400);
     }

      if (!name && !slug) {
       return errorResponse(
         res,
         "At least one of name or slug is required",
         400
       );
     }

     const updateData = {};
     if (name) updateData.name = name;
     if (slug) updateData.slug = slug;

      if (req.file) {
       const result = await cloudinary.uploader.upload(req.file.path);
       updateData.image = result.secure_url;
     }

     const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
       new: true,
     });

     if (!updatedCategory) {
       return errorResponse(res, "Category not found", 404);
     }

      if (req.file) {
       fs.unlinkSync(req.file.path);
     }

     successResponse(res, updatedCategory, "Category updated successfully");
   } catch (error) {
     return errorResponse(res, error.message || "Server Error", 500);
   }
 });


 

const getAllCities = asynchandler(async (req, res) => {
  try {
    const cities = await City.find();
    successResponse(res, cities, "Cities fetched successfully");
  } catch (error) {
    console.log(error);
    internalServerError(res, "An error occurred while fetching cities");
  }
});

 const createCity = asynchandler(async (req, res) => {
   const { name, status } = req.body;

    if (!name || !status || !req.file) {
     return validationError(res, "Name, status, and image are required fields");
   }

   try {
      const existingCity = await City.findOne({ name });
     if (existingCity) {
       return validationError(res, "City with this name already exists");
     }

      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
       folder: "cities",
     });

      const newCity = new City({
       name,
       status,
       image: uploadedImage.secure_url,
     });
     const savedCity = await newCity.save();

      fs.unlinkSync(req.file.path);

     successResponse(res, savedCity, "City created successfully");
   } catch (error) {
     console.error(error);
     internalServerError(res, "An error occurred while creating the city");
   }
 });

  const updateCity = asynchandler(async (req, res) => {
   const { name, status } = req.body;

   try {
     const city = await City.findById(req.params.id);
     if (!city) {
       return notFoundError(res, "City not found");
     }

     // Check if the new name already exists (if changing the name)
     if (name && name !== city.name) {
       const existingCity = await City.findOne({ name });
       if (existingCity) {
         return validationError(res, "City with this name already exists");
       }
     }

     // Update city fields
     city.name = name || city.name;
     city.status = status || city.status;

     // If a new image is provided, upload it and update the city image URL
     if (req.file) {
       const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
         folder: "cities",
       });
       city.image = uploadedImage.secure_url;
       fs.unlinkSync(req.file.path);
     }

     const updatedCity = await city.save();
     successResponse(res, updatedCity, "City updated successfully");
   } catch (error) {
     console.error(error);
     internalServerError(res, "An error occurred while updating the city");
   }
 });

  const deleteCity = asynchandler(async (req, res) => {
   try {
     const city = await City.findById(req.params.id);
     if (!city) {
       return notFoundError(res, "City not found");
     }

     await City.findByIdAndDelete(req.params.id);
     successResponse(res, {}, "City deleted successfully");
   } catch (error) {
     console.error(error);
     internalServerError(res, "An error occurred while deleting the city");
   }
 });

 const getAllEnabledCities = asynchandler(async (req, res) => {
   try {
     // Fetch all cities where status is "enabled"
     const enabledCities = await City.find({ status: "enabled" });

     if (enabledCities.length === 0) {
       return notFoundError(res, "No enabled cities found");
     }

     successResponse(res, enabledCities, "Enabled cities fetched successfully");
   } catch (error) {
     console.error(error);
     internalServerError(
       res,
       "An error occurred while fetching enabled cities"
     );
   }
 });


 const getUserById = asynchandler(async (req, res) => {
   const { id } = req.params; // User ID from route parameters

   try {
     const user = await User.findById(id).populate("cart"); // Populate cart if necessary
     if (!user) {
       return notFoundError(res, "User not found");
     }

     successResponse(res, user, "User fetched successfully");
   } catch (error) {
     console.error(error);
     internalServerError(res, "An error occurred while fetching the user");
   }
 });


 const addTestimonial = asynchandler(async (req, res) => {
   const { name, description } = req.body;

   if (!name || !description || !req.file) {
     return validationError(
       res,
       "Name, Description, and image are required fields."
     );
   }

   try {
     const uploadFile = await cloudinary.uploader.upload(req.file.path, {
       folder: "testimonials",
     });

     const newTestimonial = new Testimonial({
       name,
       description,
       file: uploadFile.secure_url,
     });

     await newTestimonial.save();
     
     fs.unlinkSync(req.file.path);

     res.status(201).json({
       message: "Testimonial added successfully",
       testimonial: newTestimonial,
     });
   } catch (error) {
     res.status(500).json({ error: "Server error, failed to add testimonial" });

     // Ensure the local file is deleted in case of an error during the upload
     if (req.file) {
       fs.unlinkSync(req.file.path);
     }
   }
 });


 const getAllTestimonial = asynchandler(async (req, res) => {
   try {
     const testimonials = await Testimonial.find();
     res.status(200).json(testimonials);
   } catch (error) {
     console.error("Error fetching testimonials:", error); // Log the error
     res
       .status(500)
       .json({ error: "Server error, failed to fetch testimonials" });
   }
 });

 // Delete Testimonial
 const deleteTestimonial = asynchandler(async (req, res) => {
   const { id } = req.params;

   try {
     const testimonial = await Testimonial.findById(id);

     if (!testimonial) {
       return res.status(404).json({ message: "Testimonial not found" });
     }

      const publicId = testimonial.file.split("/").pop().split(".")[0];  
     await cloudinary.uploader.destroy(`testimonials/${publicId}`);

     await testimonial.remove();
     res.status(200).json({ message: "Testimonial deleted successfully" });
   } catch (error) {
     console.error("Error deleting testimonial:", error); // Log the error
     res
       .status(500)
       .json({ error: "Server error, failed to delete testimonial" });
   }
 });

 // Update Testimonial
 const updateTestimonial = asynchandler(async (req, res) => {
   const { id } = req.params;
   const { name, description } = req.body;

   try {
     const testimonial = await Testimonial.findById(id);

     if (!testimonial) {
       return res.status(404).json({ message: "Testimonial not found" });
     }

     let updatedFile = testimonial.file;

     if (req.file) {
       const publicId = testimonial.file.split("/").pop().split(".")[0];
       await cloudinary.uploader.destroy(`testimonials/${publicId}`);

       const uploadFile = await cloudinary.uploader.upload(req.file.path, {
         folder: "testimonials",
       });
       updatedFile = uploadFile.secure_url;

       // Delete the local file after uploading to Cloudinary
       fs.unlinkSync(req.file.path);
     }

     testimonial.name = name || testimonial.name;
     testimonial.description = description || testimonial.description;
     testimonial.file = updatedFile;

     await testimonial.save();

     res.status(200).json({
       message: "Testimonial updated successfully",
       testimonial,
     });
   } catch (error) {
     console.error("Error updating testimonial:", error);

     // Ensure the local file is deleted in case of an error during the upload
     if (req.file) {
       fs.unlinkSync(req.file.path);
     }

     res
       .status(500)
       .json({ error: "Server error, failed to update testimonial" });
   }
 });

 

 const getAllUsersOrders = async (req, res) => {
   try {
     // Find all orders in the database and populate user and cart details
     const orders = await Order.find()
       .populate("user", "firstName lastName email") // Populate user details
       .populate("cart"); // Populate cart details

     if (!orders.length) {
       return res.status(404).json({ message: "No orders found" });
     }

     res.status(200).json({ orders });
   } catch (error) {
     res.status(500).json({ message: "Server error", error });
   }
};
 
const getAllUsersCart = async (req, res) => {
  try {
    // Find all carts in the database and populate user and property details
    const carts = await Cart.find()
      .populate("user", "firstName lastName email") // Populate user details
      .populate("property"); // Populate property details

    if (!carts.length) {
      return res.status(404).json({ message: "No carts found" });
    }

    res.status(200).json({ carts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllUsersWishlist = async (req, res) => {
  try {
    // Find all wishlists in the database and populate user and property details
    const wishlists = await Wishlist.find()
      .populate("user", "firstName lastName email") // Populate user details
      .populate("property"); // Populate property details

    if (!wishlists.length) {
      return res.status(404).json({ message: "No wishlists found" });
    }

    res.status(200).json({ wishlists });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  loginAdmin,
  getAllUsers,
  deleteUser,
  createCategory,
  getAllCategory,
  deleteCategory,
  updateCategory,
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
  getAllEnabledCities,
  getUserById,
  addTestimonial,
  getAllTestimonial,
  deleteTestimonial,
  updateTestimonial,
  getAllUsersOrders,
  getAllUsersCart,
  getAllUsersWishlist
  };
