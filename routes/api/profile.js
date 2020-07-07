const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/profile-model');
const User = require('../../models/users-model');
const { check, validationResult } = require('express-validator');

//@route   GET api/profile/me: private access
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res
        .status(400)
        .json({ message: 'there is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server error');
  }
});

//@route   Post api/profile: this will create or update user profile

router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required').not().isEmpty(),
      check('skills', 'skills is required').not().notEmpty(),
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).json({ errors: error.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //build profile project
    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      console.log(123);

      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    console.log(profileFields);

    res.send('hello');
  }
);

module.exports = router;
