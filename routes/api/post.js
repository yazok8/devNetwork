const express = require('express');
const auth = require('../../middleware/auth');
const path = require('path');
const User = require('../../models/users-model');
const Post = require('../../models/post-model');
const Profile = require('../../models/profile-model');
const { check, validationResult } = require('express-validator');
const router = express.Router();

//@route   Post api/post: create a post. private access
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).json('Server Error');
    }
  }
);

//@route   GET api/posts: get all posts. private access

router.get('/', auth, async (req, res) => {
  try {
    const Posts = await Post.find().sort({ date: -1 });
    res.json(Posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server Error');
  }
});

//@route   GET api/posts/:id: get posts by id. private access

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return status(400).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return status(404).json({ msg: 'Post not found' });
    }
    res.status(500).json('Server Error');
  }
});

//@route   DELETE api/post/:id: delete a post. private access

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    //check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user is not authorized' });
    }

    await post.remove();
    res.json({ msg: 'Post is removed' });
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).json('Server Error');
  }
});

//@route   PUT api/post/like/:id: like a post. private access

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.json(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
