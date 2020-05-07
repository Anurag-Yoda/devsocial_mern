const jwt = require("jsonwebtoken");
const config = require("config");
const jwttoken = config.get("jwtSecret");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token"); //get token from header

  //check if no token found
  if (!token) {
    return res.status(401).json({ msg: "No token found, Not authorized" });
  }
  // verify the token
  try {
    const tokenDecoded = jwt.verify(token, jwttoken);
    req.user = tokenDecoded.user; // user found in decoded token set equal to user who did req.
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
