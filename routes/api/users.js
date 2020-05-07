const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const {Check, validationResult} = require("express-validator");  

// register user route
router.post("/",[Check('name').not().isEmpty(), Check('email').isEmail(), Check('password').isLength({min:6})], async (req, res, next) => {
    const errors = validationResult(req);
   if(!errors.isEmpty()){
       return res.status(400).json({errors: errors.array()});
   }
  let userCreated;
  console.log(req.body);
  try {
    userCreated = await new User({
      name: req.body.name,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
  res.status(200).json(userCreated);
});

module.exports = router;
