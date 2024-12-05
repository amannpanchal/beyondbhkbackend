const mongoose = require("mongoose");
const { Schema } = mongoose;

const areaMeasurement = {
  value: { type: Number },
  unit: {
    type: String,
    enum: [
      "Sq Inches",
      "Sq Feet",
      "Sq Yards",
      "Sq Meters",
      "Sq Kilometers",
      "Sq Miles",
      "Acres",
      "Hectares",
      "Cents",
      "Guntha",
      "Bigha",
      "Katha",
      "Marla",
      "Kanals",
      "Rood",
      "Perch",
      "Ares",
      "Hides",
    ],
    default: "Sq Feet",
  },
};

const dimensionMeasurement = {
  value: { type: Number },
  unit: {
    type: String,
    enum: [
      
      "Feet",
      "Meters",
      "Yards",
      "Kilometers",
      "Miles",
      "Nautical Miles",
      "Fathoms",
      "Chains",
      "Rods",
      "Perches",
      "Cubits",
      "Hands",
      "Palms",
      "Furlongs",
      "Leagues",
    ],
    default: "Feet",
  },
};

const PropertySchema = new Schema(
  {
    propertyType: {
      type: String,
      enum: ["Plot", "Flat", "Shop/Commercial", "Land", "Bungalow/Villa","Duplex"],
      required : true
    },
    plotDetails: {
      plotLength: dimensionMeasurement,
      plotBreadth: dimensionMeasurement,
      additionalDetails: mongoose.Schema.Types.Mixed,
    },
    flatDetails: {
      floor: Number,
      totalFlats: Number,
      totalNoOfTowers: Number,
      coveredCampus: Boolean,
      isNewConstruction: { type: Boolean, default: true },
      subPropertyType: {
        type: String,
        enum: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "Studio", "Penthouse"],
      },
      additionalDetails: mongoose.Schema.Types.Mixed,
    },
    landDetails: {
      roadFront: dimensionMeasurement,
      distanceFromMainRoad: dimensionMeasurement,
      landLength: dimensionMeasurement,
      landWidth: dimensionMeasurement,
      additionalDetails: mongoose.Schema.Types.Mixed,
    },
    duplexDetails: {
      duplexSize: areaMeasurement,
      totalCampusArea: areaMeasurement,
      additionalDetails: mongoose.Schema.Types.Mixed,
    },
    bungalowVillaDetails: {
      bungalowSize: areaMeasurement,
      gardenArea: areaMeasurement,
      additionalDetails: mongoose.Schema.Types.Mixed,
      parkingSpaces: Number,
    },
    shopCommercialDetails: {
      additionalDetails: mongoose.Schema.Types.Mixed,
    },
    address: {
      city: {
        type: String,
        enum: ["Bhopal", "Indore", "Jabalpur", "Ujjain"],
        required: true,
      },
      landMark: [{
        type : String
      }],
      wholeAddress: {
        type: String,
        // required: true
      },
      googleAddress: {
        type: String,
        // required: true,
      },
    },
    propertyConstruction: {
      type: String,
      enum: [
        "Ready Possession",
        "Under Construction",
        "Construction to begin soon",
        "No Construction",
      ],
    },
    amenities: [{ type: String }],
    propertyFacing: {
      type: String,
      enum: [
        "North",
        "South",
        "East",
        "West",
        "North-East",
        "North-West",
        "South-East",
        "South-West",
      ],
    },

    totalPrice: {
      value: { type: Number, required: true },
      unit: {
        type: String,
        required: true,
        enum: ["USD", "EUR", "INR", "GBP"],
        default: "INR",
      },
    },
    totalArea: areaMeasurement,
    floorPlans: [{ label: String, description: String, image: String }],
    images: [{ imageUrl: String, label: String }],
    videos: [{ videoUrl: String, label: String }],
    description: String,
    label: String,
    imageBanner: String,
    videoBanner: String,
    propertyBrochure: [{ file: String, label: String }],
    isHotTrending: { type: Boolean, default: true },
    showOnWebsite: { type: Boolean, default: true },
    ownerDetails: {
      name: {
        type: String,
        // required: true
      },
      email: {
        type: String,
        // required: true
      },
      number: {
        type: String,
        // required: true
      },
      address: {
        type: String,
        // required: true
      },
      socialMediaLinks: {
        facebook: String,
        instagram: String,
        linkedin: String,
        twitter: String,
        
      },
    },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;
