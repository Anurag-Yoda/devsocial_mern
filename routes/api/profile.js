const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require('../../models/Profile');
const User = require('../../models/User');



//route for single user profile
router.get("/me",auth, async (req, res, next) => {
 try {
     const profile = await (await Profile.findOne({user: req.user.id})).populated('user',['name','avatar']);
     if(!profile){
         res.status(404).json({msg:'No profile found'});
     }
     res.status(200).json(profile);
 } catch (error) {
     res.status(500).json({msg:"server error"});
     return next(error)
 }
});

module.exports = router;
