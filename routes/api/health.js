const express = require('express');
const router = express.Router();

// @route   GET api/health
// @desc    Health check
// @access  Public
router.get('/', (req, res) => res.json({ status: 'OK' }));

module.exports = router;
