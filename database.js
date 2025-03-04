const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  buttonText: String,
  buttonUrl: String,
  imageUrl: String,
  backgroundColor: {
    type: String,
    default: '#ffffff',
  },
  textColor: {
    type: String,
    default: '#000000',
  },
  buttonColor: {
    type: String,
    default: '#4CAF50',
  },
  buttonTextColor: {
    type: String,
    default: '#ffffff',
  },
  position: {
    type: String,
    enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    default: 'bottom-right',
  },
  trigger: {
    type: {
      type: String,
      enum: ['time', 'scroll', 'exit'],
      default: 'time',
    },
    value: {
      type: Number,
      default: 5, // 5 seconds for time, 50% for scroll
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  notificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Create models
const Notification = mongoose.model('Notification', notificationSchema);
const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = {
  connectDB,
  Notification,
  Analytics,
}; 