const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

//route for single user profile
router.get("/me", auth, async (req, res, next) => {
  try {
    const profile = await (
      await Profile.findOne({ user: req.user.id })
    ).populated("user", ["name", "avatar"]);
    if (!profile) {
      res.status(404).json({ msg: "No profile found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ msg: "server error" });
    return next(error);
  }
});

// create or update user profile
router.post(
  "/",
  [
    auth,
    [
      check("status", "status is require").not().isEmpty(),
      check("skills", "skills is req.").not().isEmpty(),
    ],
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    // user profile object after getting the vlaues from re.body

    let profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.company = website;
    if (status) profileFields.company = status;
    if (bio) profileFields.company = bio;
    if (githubusername) profileFields.company = githubusername;
    if (bio) profileFields.company = bio;
    if (location) profileFields.company = location;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    console.log(profileFields.skills);
    res.send("hello");

    profileFields.social = {}; // define parent element of the object
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.youtube = twitter;
    if (linkedin) profileFields.social.youtube = linkedin;
    if (instagram) profileFields.social.youtube = instagram;
    if (facebook) profileFields.social.youtube = facebook;

    try {
      let profile = await Profile.findOne({ user: res.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.status(200).json(profile);
      }

      // if profile note found then create one with data entered in profileFields
      profile = new Profile(profileFields);

      await Profile.save();
      return res.json(profile);
    } catch (error) {
      console.log(error);
      res.status(500).send("Send error");
    }
  }
);

//get all profile route

router.get("/", async (req, fres, next) => {
  try {
    let profiles = Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "server error" });
  }
});

//get profile by user id

router.get("/user/:user_id", async (req, fres, next) => {
  try {
    let profile = Profile.findOne({ user: req.params.user_id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      res.status(400).json({ msg: "no profile for this user" });
    }

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;
