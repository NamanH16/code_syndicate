const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// @route  GET api/auth
// @desc   Test Route
// @access Public
router.get("/", auth, (req, res)=> res.send('Auth route'));  // just by adding 'auth' here, this makes the route protected

module.exports=router;