import mongoose from 'mongoose';

const STEP_STATUS = ["Not Started", "In Progress", "Completed"];

const OrderSchema = new mongoose.Schema({
  quote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quote",
    required: true
  },

  // Order Meta
  orderNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["Confirmed", "In Production", "Completed", "Delivered"],
    default: "Confirmed"
  },

  // Loomiz Team
  loomizTeam: {
    name: String,
    phoneNumber: String
  },

  // Manufacturer Info
  manufacturer: {
    assignedTo: String,
    capability: String,
    forecastedTime: String
  },

  // Order Details
  noOfPieces: Number,
  price: Number,
  leadTime: String,

  // Design
  designImage: String,

  // Colours
  colours: [String], // Hex codes like "#FFFFFF"

  // Sizes
  sizes: [String], // e.g. ["XS", "S", "M", "L", "XL"]

  // Production Steps
  productionSteps: {
    sampleConfirmation: {
      type: String,
      enum: STEP_STATUS,
      default: "Not Started"
    },
    fabricInhoused: {
      type: String,
      enum: STEP_STATUS,
      default: "Not Started"
    },
    fabricQualityCheck: {
      type: String,
      enum: STEP_STATUS,
      default: "Not Started"
    },
    production: {
      type: String,
      enum: STEP_STATUS,
      default: "Not Started"
    },
    packaging: {
      type: String,
      enum: STEP_STATUS,
      default: "Not Started"
    },
    qualityCheck: {
      type: String,
      enum: STEP_STATUS,
      default: "Not Started"
    },
    outForDelivery: {
      type: String,
      enum: STEP_STATUS,
      default: "Not Started"
    },
    confirmPaymentTerms: {
      type: String,
      enum: STEP_STATUS,
      default: "Not Started"
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
