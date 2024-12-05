const City = require("../Models/cityModel.js");
const cloudinary = require("../Utils/cloudinary.js");
const fs = require("fs");
const {
  successResponse,
  errorResponse,
  internalServerError,
  notFoundError,
  validationError,
} = require("../Utils/resHandler");
const asynchandler = require("express-async-handler");

// Get all cities
const getAllCities = asynchandler(async (req, res) => {
  try {
    const cities = await City.find();
    successResponse(res, cities, "Cities fetched successfully");
  } catch (error) {
    console.log(error)
    internalServerError(res, "An error occurred while fetching cities");
  }
});

// Get a single city by ID
const getCityById = asynchandler(async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return notFoundError(res, "City not found");
    }
    successResponse(res, city, "City fetched successfully");
  } catch (error) {
    console.log(error)
    internalServerError(res, "An error occurred while fetching the city");
  }
});

// Create a new city
const createCity = asynchandler(async (req, res) => {
  const { name, status } = req.body;

  // Check if required fields are present
  if (!name || !status || !req.file) {
    return validationError(res, "Name, status, and image are required fields");
  }

  try {
    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "cities",
    });

    // Create city with Cloudinary image URL
    const newCity = new City({ name, status, image: uploadedImage.secure_url });
    const savedCity = await newCity.save();

    // Remove the uploaded file from the server
    fs.unlinkSync(req.file.path);

    successResponse(res, savedCity, "City created successfully");
  } catch (error) {
    console.log(error)
    console.log(error);
    internalServerError(res, "An error occurred while creating the city");
  }
});

const updateCity = asynchandler(async (req, res) => {
  const { name, status } = req.body;
  console.log(req.params.id)

  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return notFoundError(res, "City not found");
    }

    // If image is provided, upload to Cloudinary and update city image URL
    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "cities",
      });
      city.image = uploadedImage.secure_url;
      fs.unlinkSync(req.file.path);
    }

    city.name = name || city.name;
    city.status = status || city.status;

    const updatedCity = await city.save();
    successResponse(res, updatedCity, "City updated successfully");
  } catch (error) {
    console.log(error)
    // console.log(error)
    internalServerError(res, "An error occurred while updating the city");
  }
});

// Delete a city by ID
const deleteCity = asynchandler(async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return notFoundError(res, "City not found");
    }

    await City.findByIdAndDelete(req.params.id);
    successResponse(res, {}, "City deleted successfully");
  } catch (error) {
    console.log(error)
    console.log(error);
    internalServerError(res, "An error occurred while deleting the city");
  }
});

module.exports = {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
};
