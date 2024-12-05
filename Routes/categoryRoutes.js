const express = require("express");
const upload = require("../Utils/multer.js");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} = require("../Controllers/categoryController.js");
const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", upload.single("image"), createCategory);
router.put("/:id", upload.single("image"), updateCategoryById);
router.delete("/:id", deleteCategoryById);

module.exports = router;
