const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

router.get("/", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    return res.status(500).send("server error");
  }
});

//login user route

router.post(
  "/",
  [check("email").isEmail(), check("password").exists()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    let user;
    try {
      user = await User.findOne({ email: email });
      if (!user) {
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      // compares the pass in req body with found in user by using db find method
      const isMatch = await bcrypt.compare(password, user.password); 
      if (!isMatch) {
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );

      res.status(200).send("user registered successfuly");
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
