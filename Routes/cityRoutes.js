const express = require("express");
const upload = require("../Utils/multer.js");
const {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
} = require("../Controllers/cityController.js");

const router = express.Router();

router.get("/", getAllCities);
router.get("/:id", getCityById);
router.post("/", upload.single("image"), createCity);
router.put("/:id", upload.single("image"), updateCity);
router.delete("/:id", deleteCity);

module.exports = router;
