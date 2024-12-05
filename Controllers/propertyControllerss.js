 const Property = require("../Models/propertyModel.js");
const cloudinary = require("../Utils/cloudinary.js");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const {
  successResponse,
  errorResponse,
  internalServerError,
  notFoundError,
  validationError,
} = require("../Utils/resHandler.js");
const asynchandler = require("express-async-handler");

// Get all properties
const getAllProperties = asynchandler(async (req, res) => {
  try {
    const properties = await Property.find();
    return successResponse(res, properties, "Properties fetched successfully");
  } catch (error) {
    console.error(error);
    return internalServerError(
      res,
      "An error occurred while fetching properties"
    );
  }
});

// Get a single property by ID
const getPropertyById = asynchandler(async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return notFoundError(res, "Property not found");
    }
    return successResponse(res, property, "Property fetched successfully");
  } catch (error) {
    console.error(error);
    return internalServerError(
      res,
      "An error occurred while fetching the property"
    );
  }
});

// Function to upload image to Cloudinary
const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Error uploading image to Cloudinary");
  }
};

// Create a new property
// const createProperty = asynchandler(async (req, res) => {
//   const {
//     propertyType,
//     name,
//     description,
//     country,
//     state,
//     city,
//     zip,
//     address,
//     ownerName,
//     email,
//     fb,
//     twitter,
//     instagram,
//     linkedin,
//     phone,
//     totalUnit,
//     totalRoom,
//     totalBathroom,
//     totalKitchen,
//     totalCarParking,
//     totalFloor,
//     totalSquareFeet,
//     totalPrice,
//   } = req.body;

//   if (
//     !propertyType ||
//     !name ||
//     !description ||
//     !country ||
//     !state ||
//     !city ||
//     !zip ||
//     !address ||
//     !ownerName ||
//     !email ||
//     !phone ||
//     !totalUnit ||
//     !totalRoom ||
//     !totalBathroom ||
//     !totalKitchen ||
//     !totalCarParking ||
//     !totalFloor ||
//     !totalSquareFeet ||
//     !totalPrice
//   ) {
//     return validationError(res, "All fields are required");
//   }

//   try {
//     const thumbnail = req.files["thumbnail"]
//       ? await uploadImage(req.files["thumbnail"][0])
//       : null;

//     const images = req.files["images"]
//       ? await Promise.all(req.files["images"].map((file) => uploadImage(file)))
//       : [];

//     const newProperty = new Property({
//       propertyType,
//       name,
//       description,
//       country,
//       state,
//       city,
//       zip,
//       address,
//       thumbnail,
//       images,
//       ownerName,
//       email,
//       fb,
//       twitter,
//       instagram,
//       linkedin,
//       phone,
//       totalUnit,
//       totalRoom,
//       totalBathroom,
//       totalKitchen,
//       totalCarParking,
//       totalFloor,
//       totalSquareFeet,
//       totalPrice,
//     });

//     const savedProperty = await newProperty.save();
//     return successResponse(res, savedProperty, "Property created successfully");
//   } catch (error) {
//     console.error(error);
//     return internalServerError(
//       res,
//       "An error occurred while creating the property"
//     );
//   }
// });

 

const updateProperty = asynchandler(async (req, res) => {
  const {
    propertyType,
    name,
    description,
    country,
    state,
    city,
    zip,
    address,
    ownerName,
    email,
    fb,
    twitter,
    instagram,
    linkedin,
    phone,
    totalUnit,
    totalRoom,
    totalBathroom,
    totalKitchen,
    totalCarParking,
    totalFloor,
    totalSquareFeet,
    totalPrice,
  } = req.body;

  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return notFoundError(res, "Property not found");
    }

    // Handle image uploads if provided
    if (req.files) {
      const thumbnail = req.files["thumbnail"]
        ? await uploadImage(req.files["thumbnail"][0])
        : property.thumbnail;

      const images = req.files["images"]
        ? await Promise.all(
            req.files["images"].map((file) => uploadImage(file))
          )
        : property.images;

      // Update only if new images or thumbnails are provided
      property.thumbnail = thumbnail;
      property.images = images.length > 0 ? images : property.images;
    }

    // Update fields selectively if they are provided
    Object.assign(property, {
      ...(propertyType && { propertyType }),
      ...(name && { name }),
      ...(description && { description }),
      ...(country && { country }),
      ...(state && { state }),
      ...(city && { city }),
      ...(zip && { zip }),
      ...(address && { address }),
      ...(ownerName && { ownerName }),
      ...(email && { email }),
      ...(fb && { fb }),
      ...(twitter && { twitter }),
      ...(instagram && { instagram }),
      ...(linkedin && { linkedin }),
      ...(phone && { phone }),
      ...(totalUnit && { totalUnit }),
      ...(totalRoom && { totalRoom }),
      ...(totalBathroom && { totalBathroom }),
      ...(totalKitchen && { totalKitchen }),
      ...(totalCarParking && { totalCarParking }),
      ...(totalFloor && { totalFloor }),
      ...(totalSquareFeet && { totalSquareFeet }),
      ...(totalPrice && { totalPrice }),
    });

    const updatedProperty = await property.save();
    return successResponse(
      res,
      updatedProperty,
      "Property updated successfully"
    );
  } catch (error) {
    console.error(error);
    return internalServerError(
      res,
      "An error occurred while updating the property"
    );
  }
});

// Delete a property by ID
const deleteProperty = asynchandler(async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return notFoundError(res, "Property not found");
    }

    return successResponse(res, {}, "Property deleted successfully");
  } catch (error) {
    console.error(error);
    return internalServerError(
      res,
      "An error occurred while deleting the property"
    );
  }
});


const myProperty = asynchandler(async (re, res) => {
  try { }
  catch (e) {
    
  }
})


const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});


const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    allowed_formats: ["mp4", "mov"], 
  },
});

const uploadImages = multer({ storage: imageStorage }).array('images', 10);
const uploadVideos = multer({ storage: videoStorage }).array('videos', 5);

const createProperty = asynchandler(async (req, res) => {
  try {
    
  } catch (e) {
    
  }
})





module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
