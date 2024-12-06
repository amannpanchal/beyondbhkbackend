const express = require("express");
const router = express.Router();
const {upload} = require('../Utils/cloudinary')

const { createProperty, getMyAllProperty, getAllWebsiteProperty, getSingleProperty, getAllProperty, createPropertyy, updateProperty } = require("../Controllers/propertyController");
const { validateUserToken } = require("../middlewares/authMiddleware");
const { addToCart } = require("../Controllers/userController");

// Create a new property (upload images and videos)
router.post(
  "/createproperty",validateUserToken,
  createPropertyy
);



router.post(
  "/addproperty",

  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 10 },
    { name: "videoBanner", maxCount: 1 },
    { name: "imageBanner", maxCount: 1 },
    { name: "brochureImage", maxCount: 10 },
    { name: "floorPlansImage", maxCount: 10 },
  ]),
createProperty
  
);
// router.get("/getmyproperty", validateUserToken, getMyAllProperty);
// router.get("/getallproperty", getAllProperty);
router.get("/getallwebsiteproperty", getAllWebsiteProperty)
router.get("/:id", getSingleProperty);
router.put("/:id",updateProperty);
module.exports = router;

