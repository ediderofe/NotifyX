const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Remove MongoDB dependency for demo
// const { connectDB, Notification, Analytics } = require('./database');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for demo purposes
const inMemoryNotifications = {};
const inMemoryAnalytics = {};

// Connect to database - commented out for demo
// connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Routes

// Get all notifications for a user
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    // For demo, return in-memory notifications
    const userNotifications = Object.values(inMemoryNotifications).filter(
      n => n.userId === req.params.userId
    );
    res.json(userNotifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific notification
app.get('/api/notification/:id', async (req, res) => {
  try {
    const notification = inMemoryNotifications[req.params.id];
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new notification
app.post('/api/notifications', upload.single('image'), async (req, res) => {
  try {
    const notificationId = Date.now().toString();
    const notificationData = {
      ...req.body,
      _id: notificationId,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      active: true,
      createdAt: new Date()
    };
    
    // Save to in-memory storage
    inMemoryNotifications[notificationId] = notificationData;
    
    // Create analytics entry
    inMemoryAnalytics[notificationId] = {
      notificationId,
      views: 0,
      clicks: 0,
      lastUpdated: new Date()
    };
    
    res.status(201).json(notificationData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a notification
app.put('/api/notifications/:id', upload.single('image'), async (req, res) => {
  try {
    const notificationData = { ...req.body };
    
    if (req.file) {
      notificationData.imageUrl = `/uploads/${req.file.filename}`;
      
      // Delete old image if exists
      const oldNotification = inMemoryNotifications[req.params.id];
      if (oldNotification && oldNotification.imageUrl) {
        const oldImagePath = path.join(__dirname, 'public', oldNotification.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    // Update in-memory notification
    if (!inMemoryNotifications[req.params.id]) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    inMemoryNotifications[req.params.id] = {
      ...inMemoryNotifications[req.params.id],
      ...notificationData
    };
    
    res.json(inMemoryNotifications[req.params.id]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a notification
app.delete('/api/notifications/:id', async (req, res) => {
  try {
    const notification = inMemoryNotifications[req.params.id];
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Delete image if exists
    if (notification.imageUrl) {
      const imagePath = path.join(__dirname, 'public', notification.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete notification and its analytics
    delete inMemoryNotifications[req.params.id];
    delete inMemoryAnalytics[req.params.id];
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Track notification view
app.post('/api/analytics/view/:id', async (req, res) => {
  try {
    if (!inMemoryAnalytics[req.params.id]) {
      inMemoryAnalytics[req.params.id] = {
        notificationId: req.params.id,
        views: 0,
        clicks: 0,
        lastUpdated: new Date()
      };
    }
    
    inMemoryAnalytics[req.params.id].views += 1;
    inMemoryAnalytics[req.params.id].lastUpdated = new Date();
    
    res.json(inMemoryAnalytics[req.params.id]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Track notification click
app.post('/api/analytics/click/:id', async (req, res) => {
  try {
    if (!inMemoryAnalytics[req.params.id]) {
      inMemoryAnalytics[req.params.id] = {
        notificationId: req.params.id,
        views: 0,
        clicks: 0,
        lastUpdated: new Date()
      };
    }
    
    inMemoryAnalytics[req.params.id].clicks += 1;
    inMemoryAnalytics[req.params.id].lastUpdated = new Date();
    
    res.json(inMemoryAnalytics[req.params.id]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get analytics for a notification
app.get('/api/analytics/:id', async (req, res) => {
  try {
    const analytics = inMemoryAnalytics[req.params.id];
    if (!analytics) {
      return res.status(404).json({ message: 'Analytics not found' });
    }
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve the notifyx.js file
app.get('/notifyx.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notifyx.js'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 