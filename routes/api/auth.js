const express = require('express')
const router = express.Router()
const auth  = require('../../middleware/auth')
const User = require('../../models/users-model')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

dotenv.config()

// @route   GET api/auth
// @desc    Get user by token
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  }catch (error) { // Correct variable name
    console.log(error.message); // Use 'error' instead of 'err'
    res.status(500).send('Server Error');
  }
})

// this route will allow the user to login.
//Authenticate user & get TOKEN
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Compare is a bcrypt method
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payLoad = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payLoad,
        process.env.JWT_SECRET,
        { expiresIn: '15m' },
        (err, token) => { // Use 'token' here instead of 'accessToken'
          if (err) throw err;
          jwt.sign(
            payLoad,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, refreshToken) => {
              if (err) throw err;
              res
                .cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
                .json({ token }); // Return token with key "token"
            }
          );
        }
      );
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ msg: 'No refresh token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const payload = {
      user: {
        id: decoded.user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
      (err, accessToken) => {
        if (err) throw err;
        res.json({ accessToken });
      }
    );
  } catch (err) {
    res.status(401).json({ msg: 'Invalid refresh token' });
  }
});



module.exports = router
