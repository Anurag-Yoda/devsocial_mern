const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("posts router");
});

module.exports = router;
