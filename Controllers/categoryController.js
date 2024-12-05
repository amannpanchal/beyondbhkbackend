const Category = require("../Models/categoryModel.js");
const cloudinary = require("../Utils/cloudinary.js");
const {
  successResponse,
  errorResponse,
  internalServerError,
  notFoundError,
} = require("../Utils/resHandler");

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    successResponse(res, categories, "Categories fetched successfully");
  } catch (error) {
    console.error("Error fetching categories:", error);
    internalServerError(res, "Server Error");
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return notFoundError(res, "Category not found");
    }
    successResponse(res, category, "Category fetched successfully");
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    internalServerError(res, "Server Error");
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, icon, slug } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path);
    const image = result.secure_url;
    const newCategory = new Category({ name, icon, slug, image });
    const savedCategory = await newCategory.save();
    successResponse(res, savedCategory, "Category created successfully");
  } catch (error) {
    console.error("Error creating category:", error);
    internalServerError(res, "Server Error");
  }
};

// Update category by ID
const updateCategoryById = async (req, res) => {
  try {
    const { name, icon, slug } = req.body;
    let image;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.secure_url;
    }
    const category = await Category.findById(req.params.id);
    if (!category) {
      return notFoundError(res, "Category not found");
    }
    category.name = name;
    category.icon = icon;
    category.slug = slug;
    if (image) {
      category.image = image;
    }
    const updatedCategory = await category.save();
    successResponse(res, updatedCategory, "Category updated successfully");
  } catch (error) {
    console.error("Error updating category:", error);
    internalServerError(res, "Server Error");
  }
};

// Delete category by ID
const deleteCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return notFoundError(res, "Category not found");
    }
    await category.remove();
    successResponse(res, null, "Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    internalServerError(res, "Server Error");
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};
