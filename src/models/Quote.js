// models/Quote.js
import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema({
  shippingAddress: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  leadTime: {
    type: String,
    required: true
  },
  targetPrice: {
    type: Number,
    required: true
  },
  fabricComposition: {
    type: String,
    required: true
  },
  gsm: {
    type: String,
    required: true
  },
  orderNotes: {
    type: String
  },
  orderSample: {
    type: Boolean,
    default: false
  },

  sampleCount:{
    type: Number,
    default: 0
  },

  status:{
    type: String,
    enum: ["Pending","Accepted","Rejected"],
    default: "Pending"
  },

  comments:{
    type: String,
    default:"Sorry,We can not process your order."
  },  

  // File URLs stored after upload to Cloudinary
  techpackFile: {
    type: String
  },
  productImagesFiles: {
    type: [String]
  },
  colorSwatchFiles: {
    type: [String]
  },
  fabricFiles: {
    type: [String]
  },
  miscellaneousFiles: {
    type: [String]
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Use this approach to prevent model recompilation errors
export default mongoose.models.Quote || mongoose.model('Quote', QuoteSchema);