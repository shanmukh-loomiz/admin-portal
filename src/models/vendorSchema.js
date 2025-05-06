// models/vendorSchema.js
import mongoose from 'mongoose';

// Contact Schema (for both primary and secondary contacts)
const ContactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  alternativePhoneNumber: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  }
});

// Address Schema
const AddressSchema = new mongoose.Schema({
  addressProofType: {
    type: String,
    required: true,
    trim: true
  },
  addressProofDocument: {
    type: String,  // URL or path to uploaded document
    required: true
  },
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true
  }
});

// Bank Details Schema
const BankDetailsSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true
  },
  bankAddress: {
    type: String,
    required: true,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true
  },
  swiftCode: {
    type: String,
    required: true,
    trim: true
  },
  cancelledCheque: {
    type: String,  // URL or path to uploaded document
    required: true
  }
});

// Certification Schema
const CertificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  document: {
    type: String,  // URL or path to uploaded document
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

// Main Vendor Schema
const VendorSchema = new mongoose.Schema({
  // Primary Contact (Vendor Details)
  primaryContact: {
    type: ContactSchema,
    required: true
  },
  
  // Secondary Contact
  secondaryContact: {
    type: ContactSchema,
    required: false
  },
  
  // Company Details
  company: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    firmType: {
      type: String,
      enum: ['Proprietorship', 'Partnership', 'Private Limited', 'Public Limited', 'LLP', 'Other'],
      required: true
    },
    turnover: {
      type: Number,  // Previous year turnover in INR Crores
      required: true
    },
    utilizationCapacity: {
      type: String,
      required: true
    },
    supplierType: {
      type: String,
      required: true
    },
    numberOfMachines: {
      type: Number,
      required: true
    },
    productSpecifications: {
      type: String,
      enum: ['Knit', 'Woven', 'Others'],
      required: true
    },
    workerType: {
      type: String,
      required: true
    },
    numberOfWorkers: {
      type: Number,
      required: true
    },
    prominentBrands: {
      type: [String],
      required: true,
      validate: [arrayMinLength, 'At least 3 prominent brands are required']
    }
  },
  
  // Company Address
  address: {
    type: AddressSchema,
    required: true
  },
  
  // Document Verification
  documents: {
    gstNumber: {
      type: String,
      required: true,
      trim: true
    },
    gstDocument: {
      type: String,  // URL or path to uploaded document
      required: true
    },
    panNumber: {
      type: String,
      required: true,
      trim: true
    },
    panDocument: {
      type: String,  // URL or path to uploaded document
      required: true
    },
    hasMsmeCertificate: {
      type: Boolean,
      required: true
    },
    msmeDocument: {
      type: String,  // URL or path to uploaded document
      required: function() {
        return this.hasMsmeCertificate;
      }
    },
    certifications: {
      sedex: {
        type: String,
        default: null  // URL or path to uploaded document
      },
      bsci: {
        type: String,
        default: null
      },
      fama: {
        type: String,
        default: null
      },
      fa8000: {
        type: String,
        default: null
      },
      gots: {
        type: String,
        default: null
      },
      grs: {
        type: String,
        default: null
      },
      ocs: {
        type: String,
        default: null
      },
      iso: {
        type: String,
        default: null
      },
      bci: {
        type: String,
        default: null
      },
      ctpat: {
        type: String,
        default: null
      },
      wrap: {
        type: String,
        default: null
      },
      qms: {
        type: String,
        default: null
      }
    }
  },
  
  // Bank Details
  bankDetails: {
    type: BankDetailsSchema,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'incomplete'],
    default: 'pending'
  },

   // Production Status
   ProductionStatus: {
    type: String,
    enum: [
      'not_started',     // Production not yet begun
      'in_progress',     // Actively being manufactured
      'quality_check',   // In QC phase
      'completed',       // Fully manufactured and passed QC
      'on_hold',         // Halted due to issue
      'cancelled'        // Canceled before completion
    ],
    
    default: 'not_started'
  },
  
  // Order Status
  OrderStatus: {
    type: String,
    enum: [
      'pending',         // Just placed, awaiting processing
      'confirmed',       // Confirmed by vendor/admin
      'in_production',   // Being manufactured
      'ready_for_dispatch', // Finished and packed
      'shipped',         // Shipped to customer
      'delivered',       // Received by customer
      'cancelled',       // Order cancelled by either side
      'returned'         // Returned by customer
    ],
    default: 'pending'
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Array minimum length validator
function arrayMinLength(val) {
  return val.length >= 3;
}

// Update the updatedAt field on save
VendorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model if it doesn't exist, otherwise use the existing one
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);

export default Vendor;