const express = require("express");
const router = express.Router();
const {
  loginSuperAdmin,
  getAllUsers,
  deleteUser,
} = require("../Controllers/superAdminController");
const { validateTokenForRoles } = require("../middlewares/authMiddleware.js");

// Super Admin login route
router.post("/superadmin/login", loginSuperAdmin);

// Route to get all users (Super Admin only)
router.get(
  "/superadmin/users",
  validateTokenForRoles(["superAdmin"]),
  getAllUsers
);

// Route to delete a user by ID (Super Admin only)
router.delete(
  "/superadmin/user/:id",
  validateTokenForRoles(["superAdmin"]),
  deleteUser
);

module.exports = router;
