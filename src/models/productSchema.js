// models/Product.js
import mongoose from 'mongoose';

// Define a schema that can handle dynamic fields in attributes
const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Please provide a product ID'],
    unique: true,
    trim: true,
  },
  productName: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  priceRange: {
    type: String,
    trim: true,
  },
  quantityPerOrder: {
    type: String,
    trim: true,
  },
  // Store arrays of image URLs (max 5 for each type)
  productImages: [{
    type: String,
    trim: true,
  }],
  measurementSpecs: [{
    type: String,
    trim: true,
  }],
  // Store attributes as a flexible array of objects
  // Each object can have a fields property with arbitrary key-value pairs
  attributes: [{
    fields: {
      type: Map,
      of: String
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Validate that there are no more than 5 product images
ProductSchema.path('productImages').validate(function(value) {
  return value.length <= 5;
}, 'A maximum of 5 product images is allowed');

// Validate that there are no more than 5 measurement specs
ProductSchema.path('measurementSpecs').validate(function(value) {
  return value.length <= 5;
}, 'A maximum of 5 measurement spec images is allowed');

// Update the updatedAt timestamp before saving
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model only if it doesn't already exist
// This is important for Next.js which may call this file multiple times
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);