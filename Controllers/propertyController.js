const multer = require("multer");
const Property = require("../Models/propertyModel.js");
const { cloudinary } = require("../Utils/cloudinary.js");


// Controller to create a new property
exports.createPropertyy = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please log in to add a property." });
    }

    // Extracting data from the request body
    const propertyData = req.body;

    // Assigning the logged-in user's ID to the `postedBy` field
    propertyData.postedBy = req.user._id;

    // Validating required fields
    if (
      !propertyData.totalPrice ||
      !propertyData.totalPrice.value ||
      !propertyData.totalPrice.unit
    ) {
      return res
        .status(400)
        .json({ error: "Total price is required with value and unit." });
    }
    if (!propertyData.propertyType) {
      return res.status(400).json({ error: "Property type is required." });
    }

    // Creating a new property document
    const newProperty = new Property(propertyData);

    // Saving to the database
    const savedProperty = await newProperty.save();

    // Responding with the saved property
    res.status(201).json({
      message: "Property created successfully.",
      data: savedProperty,
    });
  } catch (error) {
    console.error("Error creating property:", error.message);
    res.status(500).json({
      error: "An error occurred while creating the property.",
      details: error.message,
    });
  }
};




exports.createProperty = async (req, res) => {
  try {
    const {
      propertyType,
      flatDetails,
      plotDetails,
      landDetails,
      duplexDetails,
      bungalowVillaDetails,
      shopCommercialDetails,
      address,
      propertyConstructionStatus,
      aminities,
      propertyFacing,
      prominentLandmarksNearby,
      totalPrice,
      totalArea,
      floorPlans,
      images,
      videos,
      description,
      label,
      imageBanner,
      videoBanner,
      propertyBrochure,
      isHotTrending,
      showOnWebsite,
      ownerDetails,
    } = req.body;

    const { files } = req;
    const uploadedImage = [];
    const uploadedVideos = [];
    const uploadedFloorPlans = [];
    const uploadedBrochure = [];

    if (files?.images) {
      files.images.forEach((item) => {
        const newImage = {
          imageUrl : item.path
        };
        uploadedImage.push(newImage);
      });
    }

    if (files?.videos) {
      files.videos.forEach((item) => {
         const newVideo = {
           videoUrl: item.path,
         };
        uploadedVideos.push(newVideo);
      });
    }

    if (files?.brochureImage) {
      files.brochureImage.forEach((item, index) => {
        if (req.body.brochureLabel) {
          let newbrochureLabel = JSON.parse(req.body.brochureLabel);
          let brochureItem = {
            file: item.path,
            label: newbrochureLabel[index],
          };
          uploadedBrochure.push(brochureItem);
        }
      });
    }

    if (files?.floorPlansImage) {
      files.floorPlansImage.forEach((item, index) => {
        if (req.body.floorPlansLabelAndDescription) {
          let newFloorPlanLabel = JSON.parse(
            req.body.floorPlansLabelAndDescription
          );

          let floorPlan = {
            image: item.path,
            label: newFloorPlanLabel[index]?.label,
            description: newFloorPlanLabel[index]?.description,
          };

          uploadedFloorPlans.push(floorPlan);
        }
      });
    }

    const newProperty = {
      ...(propertyType && { propertyType }),
      ...(address && { address: JSON.parse(address) }),
      ...(propertyConstructionStatus && { propertyConstructionStatus }),
      ...(aminities && { aminities }),
      ...(propertyFacing && { propertyFacing }),
      ...(prominentLandmarksNearby && { prominentLandmarksNearby }),
      ...(totalPrice && { totalPrice: JSON.parse(totalPrice) }),
      ...(totalArea && { totalArea: JSON.parse(totalArea) }),
      ...(uploadedFloorPlans.length > 0 && { floorPlans: uploadedFloorPlans }),
      ...(uploadedImage.length > 0 && { images: uploadedImage }),
      ...(uploadedVideos.length > 0 && { videos: uploadedVideos }),
      ...(description && { description }),
      ...(label && { label }),
      ...(files?.imageBanner && {
        imageBanner: files.imageBanner[0]?.url,
      }),
      ...(files?.videoBanner && {
        videoBanner: files.videoBanner[0]?.url,
      }),
      ...(uploadedBrochure.length > 0 && { brochure: uploadedBrochure }),
      ...(ownerDetails && { ownerDetails }),
      postedBy: req.user?._id,
    };

    const property = await Property.create(newProperty);

    // Add specific details based on property type if they exist
    switch (propertyType) {
      case "Flat":
        if (flatDetails) property.flatDetails = JSON.parse(flatDetails);
        break;
      case "Plot":
        if (plotDetails) property.plotDetails = JSON.parse(plotDetails);
        break;
      case "Land":
        if (landDetails) property.landDetails = JSON.parse(landDetails);
        break;
      case "Duplex":
        if (duplexDetails) property.duplexDetails = JSON.parse(duplexDetails);
        break;
      case "Bungalow/Villa":
        if (bungalowVillaDetails)
          property.bungalowVillaDetails = JSON.parse(bungalowVillaDetails);
        break;
      case "Shop/Commercial":
        if (shopCommercialDetails)
          property.shopCommercialDetails = JSON.parse(shopCommercialDetails);
        break;
      default:
        return res
          .status(400)
          .json({ message: "Invalid property type selected" });
    }

    await property.save();
    res.status(201).json(property);
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "Create Property failed.",
      error: e.message,
    });
  }
};













































exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      propertyType,
      flatDetails,
      plotDetails,
      landDetails,
      duplexDetails,
      bungalowVillaDetails,
      shopCommercialDetails,
      address,
      propertyConstructionStatus,
      aminities,
      propertyFacing,
      prominentLandmarksNearby,
      totalPrice,
      totalArea,
      floorPlans,
      images,
      videos,
      description,
      label,
      imageBanner,
      videoBanner,
      propertyBrochure,
      isHotTrending,
      showOnWebsite,
      ownerDetails,
      postedBy,
    } = req.body;

    const updatedData = {
      propertyType,
      address,
      propertyConstructionStatus,
      aminities,
      propertyFacing,
      prominentLandmarksNearby,
      totalPrice,
      totalArea,
      floorPlans,
      images,
      videos,
      description,
      label,
      imageBanner,
      videoBanner,
      propertyBrochure,
      isHotTrending,
      showOnWebsite,
      ownerDetails,
      postedBy,
    };

    // Select the details based on property type
    switch (propertyType) {
      case "Flat":
        updatedData.flatDetails = flatDetails;
        break;
      case "Plot":
        updatedData.plotDetails = plotDetails;
        break;
      case "Land":
        updatedData.landDetails = landDetails;
        break;
      case "Duplex":
        updatedData.duplexDetails = duplexDetails;
        break;
      case "Bungalow/Villa":
        updatedData.bungalowVillaDetails = bungalowVillaDetails;
        break;
      case "Shop/Commercial":
        updatedData.shopCommercialDetails = shopCommercialDetails;
        break;
      default:
        return res
          .status(400)
          .json({ message: "Invalid property type selected" });
    }

    // Update the property in the database
    const property = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Error updating property", error });
  }
};


exports.getMyAllProperty = async (req, res) => {
  try {
    const properties = await Property.find({ postedBy: req.user._id });
    return res.status(200).json({
      success: true,
      message: "All Properties are fetched.",
      properties,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "All Properties fetching is failed..",
      properties,
    });
  }
};
exports.getAllWebsiteProperty  = async (req, res) => {
  try {
    const properties = await Property.find({
      // showOnWebsite : true
    })
    return res.status(200).json({
      success: true,
      message: "All Properties are fetched.",
      properties,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "All Properties fetching is failed..",
      
    });
  }
};

exports.getSingleProperty = async (req, res) => {
  try {
    const id = req.params.id;

    const property = await Property.findOne({
      _id: id,
    })
    res.status(200).json({
      success: true,
      message: "Property fetched successfully.",
      property
    })

  } catch (e) {
    return res.status(400).json({
      success: false,
      message : "Getting single property is failed."
    })
  }
}

exports.getAllProperty = async (req, res) =>{ 

  try {
    const property = await Property.find({})
    return res.status(200).json({
      success: true,
      message: "Getting all property.",
      property
    })

  
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "Properties not fetched",
      error :e.message
    })
}

};









