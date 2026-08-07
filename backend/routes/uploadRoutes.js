const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authMiddleware } = require('../middleware/auth');

// Protect upload endpoint with authMiddleware
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or invalid file format.' });
    }
    // Return uploaded filename
    res.json({
      message: 'Image uploaded successfully.',
      filename: req.file.filename,
      filepath: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Image upload failed.' });
  }
});

module.exports = router;
