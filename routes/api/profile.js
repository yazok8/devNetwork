const express = require('express');
const request = require('request');
const dotenv = require('dotenv');
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/profile-model')
const User = require('../../models/users-model')
const Post = require('../../models/post-model')
const { check, validationResult } = require('express-validator')
const { response } = require('express')

dotenv.config();

//@route   GET api/profile/me: get current user profile private access
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
    const error = validationResult(req)
    if (!error.isEmpty()) {
      res.status(400).json({ errors: error.array() })
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
    } = req.body

    //build profile project
    const profileFields = {}

    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername

    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim())
    }

    //build social object
    //we have to initialize it here otherwise it will throw an error if we for e.g. console.log(profileFields.social.twitter)
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (facebook) profileFields.social.facebook = facebook
    if (twitter) profileFields.social.twitter = twitter
    if (instagram) profileFields.social.instagram = instagram
    if (linkedin) profileFields.social.linkedin = linkedin

    try {
      let profile = await Profile.findOne({ user: req.user.id })

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )

        return res.json(profile)
      }

      //create profile

      profile = new Profile(profileFields)
      await profile.save()
      res.json(profile)
    } catch (error) {
      console.log(error.message)
      res.status(500).send('server error')
    }
  }
)

//@route   GET api/profile: this will get all profiles.

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

//@route   GET api/profile/user/:user_id: this will get  profiles by user ID Public Access
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar'])
    res.json(profile)

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' })
    }
  } catch (err) {
    console.log(err.message)
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' })
    }
    res.status(500).send('Server Error')
  }
})

//@route   GET api/profile: this will delete profile, user and posts. Private acces

router.delete('/', auth, async (req, res) => {
  try {
    //remove user posts later

    await Post.deleteMany({ user: req.user.id })

    //this will remove profile
    await Profile.findOneAndRemove({ user: req.user.id })

    //remove user
    await User.findOneAndRemove({ _id: req.user.id })

    res.json({ msg: 'User Deleted' })
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

//@route   PUT api/profile/experience: this will allow us to add profile experience. Private acces

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })

      //use unshift to push to the beginning of the array instead of the end.
      profile.experience.unshift(newExp)

      await profile.save()
      res.json(profile)
    } catch (err) {
      console.log(err.message)
      res.status(500).send('Server Error')
    }
  }
)

//@route   delete api/profile/experience: this will allow us to delete profile experience. Private acces

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    })

    //Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1)

    await profile.save()
    res.json(profile)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

//@route   PUT api/profile/education: this will allow us to add education to the  profiles. Private acces

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })

      profile.education.unshift(newEdu)

      await profile.save()

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

//@route   delete api/profile/experience: this will allow us to delete profile experience. Private acces

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    })

    //Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.exp_id)

    profile.education.splice(removeIndex, 1)

    await profile.save()
    res.json(profile)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

//@route   GET api/profile/github/:username: this will get user repos from github Public acces

router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${process.env.githubClientId}&
      client_secret=${process.env.githubSecret}`,
      method: 'GET',
      headers: {
        'user-agent': 'node.js',
      },
    }

    request(options, (error, response, body) => {
      if (error) console.log(error)

      if (response.statusCode != 200) {
        return res.status(404).json({ msg: 'No github profile found' })
      }
      res.json(JSON.parse(body))
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).send('')
  }
})

module.exports = router
