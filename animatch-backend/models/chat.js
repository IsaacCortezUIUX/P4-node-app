// routes/chat.js

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Chat = require('../models/chat'); // Import the Chat model
const User = require('../models/user'); // Import the User model
const router = express.Router();

// Send a message
router.post('/send', authMiddleware, async (req, res) => {
  const { receiver, message } = req.body;
  const senderId = req.user.id; // Get sender ID from token

  try {
    const chatMessage = new Chat({
      sender: senderId,
      receiver,
      message,
    });

    await chatMessage.save(); // Save message to database
    res.status(200).json({ msg: 'Message sent', chatMessage });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).send('Server error');
  }
});

// Get chat history with a specific user
router.get('/history/:receiverId', authMiddleware, async (req, res) => {
  const senderId = req.user.id; // Get sender ID from token
  const receiverId = req.params.receiverId;

  try {
    const chatHistory = await Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).populate('sender', 'name') // Optionally populate sender info
      .populate('receiver', 'name'); // Optionally populate receiver info

    res.json(chatHistory);
  } catch (err) {
    console.error('Error retrieving chat history:', err);
    res.status(500).send('Server error');
  }
});

// Get matched users for chatting
router.get('/matches', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('favoriteAnime');
    const matches = await User.find({
      _id: { $ne: userId },
      'favoriteAnime.title': { $in: user.favoriteAnime.map(anime => anime.title) },
    }).select('name favoriteAnime'); // Adjust the fields as needed

    res.json(matches);
  } catch (err) {
    console.error('Error retrieving matches:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
