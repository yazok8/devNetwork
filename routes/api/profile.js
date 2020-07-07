const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/profile-model');
const User = require('../../models/users-model');
const { check, validationResult } = require('express-validator');

//@route   GET api/profile/me: get current user profile private access
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
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    //build social object
    //we have to initialize it here otherwise it will throw an error if we for e.g. console.log(profileFields.social.twitter)
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //create profile

      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('server error');
    }
  }
);

//@route   GET api/profile: this will get all profiles.

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//@route   GET api/profile/user/:user_id: this will get  profiles by user ID
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    res.json(profile);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
