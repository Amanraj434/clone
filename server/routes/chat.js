const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Message = require('../models/Message');
const Match = require('../models/Match');
const User = require('../models/User');

// GET /api/messages/:matchId — Fetch messages for a match
router.get('/:matchId', auth, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    // Ensure requester is part of the match
    if (!match.users.includes(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const messages = await Message.find({ matchId: req.params.matchId })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/messages/:matchId — Send a message (enforces women-first logic)
router.post('/:matchId', auth, async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (!match.users.map(String).includes(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Women-first check: if no message sent yet, only female can initiate
    const messageCount = await Message.countDocuments({ matchId: req.params.matchId });
    if (messageCount === 0) {
      const sender = await User.findById(req.user.id);
      if (sender.gender !== 'female') {
        return res.status(403).json({ message: 'Women must initiate the conversation' });
      }
      // Mark match as female-initiated
      match.femaleInitiated = true;
      await match.save();
    }

    const message = new Message({
      matchId: req.params.matchId,
      senderId: req.user.id,
      text: req.body.text
    });
    await message.save();

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
