const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");

//create new post
router.get(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.log(error);
      res.status(500).send("Send error");
    }
  }
);

//get all post route

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//get post by id

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "No post found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No post found" });
    }
    res.status(500).send("Server Error");
  }
});

//Delete post by Id

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "No post found" });
    }

    //Check user auth

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user not authorized " });
    }
    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "No post found" });
    }
    res.status(500).send("Server Error");
  }
});

// LIKE A POST - PRIVATE

router.put("/like/:id", auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if user has already liked the post

    // if filter returns true means it has length > 0 thus user has liked the post
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Already liked " });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
});

// UNLIKE A POST - PRIVATE

router.put("/like/:id", auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if user has already liked the post

    // if filter returns true means it has length = 0 thus user has not liked the post
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post not liked yet" });
    }
    // Get remove index to remove the like

    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
});

//Add a Comment route
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.log(error);
      res.status(500).send("Send error");
    }
  }
);

//Delete a Comment

router.delete("/comment/:id/:comment_id", auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    //Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    //if no comment exists
    if (!comment) {
      return res.status(400).json({ msg: "No comment found" });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not Authoirzed" });
    }

    //Remove comment
    // Get remove index to remove the comment

    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);
    await post.save();
  } catch (error) {
    console.log(error);
    res.status(500).send("Send error");
  }
});

module.exports = router;
