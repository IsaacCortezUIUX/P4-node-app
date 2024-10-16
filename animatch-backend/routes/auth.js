const express = require('express');
const router = express.Router(); // Ensure this line is present
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');
const chatRoutes = require('./chat');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// User Registration
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ msg: 'User registered successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// User Login
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: { id: user.id },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get Favorite Anime
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoriteAnime');
    res.json(user.favoriteAnime);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add Favorite Anime
router.post('/favorites', authMiddleware, async (req, res) => {
  const { title, genre, rating } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.favoriteAnime.push({ title, genre, rating });
    await user.save();
    res.status(201).json({ msg: 'Anime added to favorites', favoriteAnime: user.favoriteAnime });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Match Users Based on Favorite Anime
router.get('/match', authMiddleware, async (req, res) => {
    try {
      // Get the current user and populate their favorite anime
      const user = await User.findById(req.user.id).populate('favoriteAnime');
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Find matches based on favorite anime titles
      const matches = await User.find({
        _id: { $ne: user._id },
        'favoriteAnime.title': { $in: user.favoriteAnime.map(anime => anime.title) }
      }).populate('favoriteAnime'); // Populate favoriteAnime to get full details
  
      res.json(matches);
    } catch (err) {
      console.error('Error fetching matches:', err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });
  

// Use chat routes
router.use('/chat', chatRoutes);

module.exports = router;
