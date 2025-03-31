const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');  // Assuming you have a Notification model

// Get notifications for a user
router.get('/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId });
        if (notifications.length === 0) {
            return res.status(404).json({ error: 'No notifications found' });
        }
        res.json(notifications);  // Send notifications
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
