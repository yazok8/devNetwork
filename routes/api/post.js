const express = require('express');
const router = express.Router();

//@route   GET api/post
router.get('/', (req, res) => {
  res.send('Post Route');
});

module.exports = router;
