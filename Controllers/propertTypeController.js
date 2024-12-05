const PropertyType = require("../Models/propertyTypeModel.js");
const {
  successResponse,
  errorResponse,
  internalServerError,
  notFoundError,
  validationError,
} = require("../Utils/resHandler.js");
const asyncHandler = require("express-async-handler");

// Get all property types
const getAllPropertyTypes = asyncHandler(async (req, res) => {
  const propertyTypes = await PropertyType.find();
  successResponse(res, propertyTypes, "Property types fetched successfully");
});

// Get property type by ID
const getPropertyTypeById = asyncHandler(async (req, res) => {
  const propertyType = await PropertyType.findById(req.params.id);
  if (!propertyType) {
    return notFoundError(res, "Property type not found");
  }
  successResponse(res, propertyType, "Property type fetched successfully");
});

// Create a new property type
const createPropertyType = asyncHandler(async (req, res) => {
  const { name, status } = req.body;

  if (!name || !status) {
    return notFoundError(res, "Please Fill all input Fields");
  }

  const newPropertyType = new PropertyType({ name, status });
  const savedPropertyType = await newPropertyType.save();
  successResponse(res, savedPropertyType, "Property type created successfully");
});

// Update property type by ID
const updatePropertyTypeById = asyncHandler(async (req, res) => {
  const { name, status } = req.body;
  let propertyType = await PropertyType.findById(req.params.id);
  if (!propertyType) {
    return notFoundError(res, "Property type not found");
  }
  propertyType.name = name;
  propertyType.status = status;
  const updatedPropertyType = await propertyType.save();
  successResponse(
    res,
    updatedPropertyType,
    "Property type updated successfully"
  );
});

// Delete property type by ID
const deletePropertyTypeById = asyncHandler(async (req, res) => {
  let propertyType = await PropertyType.findById(req.params.id);
  if (!propertyType) {
    return notFoundError(res, "Property type not found");
  }
  await PropertyType.findByIdAndDelete(req.params.id);
  successResponse(res, "Property type deleted successfully");
});

module.exports = {
  getAllPropertyTypes,
  getPropertyTypeById,
  createPropertyType,
  updatePropertyTypeById,
  deletePropertyTypeById,
};
