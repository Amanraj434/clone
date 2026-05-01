const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Like = require('../models/Like');
const Match = require('../models/Match');
const User = require('../models/User');

// POST /api/like — Like a user, create match on mutual like
router.post('/', auth, async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId } = req.body;

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: 'Cannot like yourself' });
    }

    // Record the like (ignore duplicate)
    await Like.findOneAndUpdate(
      { fromUserId, toUserId },
      { fromUserId, toUserId },
      { upsert: true, new: true }
    );

    // Check for mutual like
    const mutual = await Like.findOne({ fromUserId: toUserId, toUserId: fromUserId });
    if (mutual) {
      // Avoid duplicate matches
      const existingMatch = await Match.findOne({ users: { $all: [fromUserId, toUserId] } });
      if (!existingMatch) {
        const match = new Match({ users: [fromUserId, toUserId], femaleInitiated: false });
        await match.save();
        return res.status(201).json({ matched: true, match });
      }
      return res.json({ matched: true, message: 'Already matched' });
    }

    res.json({ matched: false, message: 'Like recorded' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/matches — Get all matches for current user
router.get('/', auth, async (req, res) => {
  try {
    const matches = await Match.find({ users: req.user.id })
      .populate('users', '-password')
      .sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
