const express = require("express");
const router = express.Router();
const {
  
  loginAdmin,
  getAllUsers,
  deleteUser,
  createCategory,
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
  getAllEnabledCities,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAllTestimonial,
  getAllUsersOrders,
  getAllUsersCart,
  getAllUsersWishlist,
  getAllCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/adminController");
const { validateTokenForRoles } = require("../middlewares/authMiddleware");
const upload = require("../Utils/multer");

router.post("/login", loginAdmin);
router.get("/users", getAllUsers);
router.delete("/user/:id", deleteUser);

// Route to get all categories
router.post("/addCategory", upload.single("image"), createCategory);
router.get("/getAllCategory", getAllCategory);
router.delete("/deleteCategory/:id", deleteCategory);
router.put("/updateCategory/:id", upload.single("image"), updateCategory);

// Get all cities
router.post("/addCity", upload.single("image"), createCity);
router.get("/getAllCities", getAllCities);
router.put("/updateCity/:id", upload.single("image"), updateCity);
router.delete("/deleteCity/:id", deleteCity);
router.get("/getAllEnableCities", getAllEnabledCities);



router.post("/addtestimonial", upload.single("file"), addTestimonial);
router.get("/testimonials", getAllTestimonial);
router.delete("/testimonial/:id", deleteTestimonial);
router.put("/testimonial/:id", upload.single("file"), updateTestimonial);



router.get("/allOrders", getAllUsersOrders);
router.get("/allUserCarts", getAllUsersCart);
router.get("/allUserWishlist", getAllUsersWishlist);

module.exports = router;
