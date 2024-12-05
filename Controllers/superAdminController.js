const User = require("../Models/userModel");
const asynchandler = require("express-async-handler");
const {
  successResponse,
  errorResponse,
  internalServerError,
} = require("../Utils/resHandler");

// Super Admin login functionality
const loginSuperAdmin = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  try {
     const user = await User.findOne({ email, role: "superAdmin" });
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
      "Super Admin login successful"
    );
  } catch (error) {
    return internalServerError(res, error.message);
  }
});

// Get all users (Super Admin-only route)
const getAllUsers = asynchandler(async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find();

    if (!users || users.length === 0) {
      return errorResponse(res, "No users found", 404);
    }

    return successResponse(res, { users }, "Users fetched successfully");
  } catch (error) {
    return internalServerError(res, error.message);
  }
});

// Delete a user by ID (Super Admin-only route)
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


module.exports = {
  loginSuperAdmin,
  getAllUsers,
  deleteUser,
};
