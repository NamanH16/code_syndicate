const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const User = require("../../models/User")
const jwt = require("jsonwebtoken");
const config = require('config');
const { body, validationResult } = require('express-validator');

// @route  GET api/auth
// @desc   Test Route
// @access Public
router.get("/", auth, async (req, res)=> {   // just by adding 'auth' here, this makes the route protected
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(error){
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});  

// @route  POST api/users
// @desc   Authenticate user and get token 
// @access Public

router.post("/",

    body("email", "Enter a valid email").isEmail(),
    body("password", "Password is required").exists(),
async (req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    const {email, password} = req.body;

    try {
        // See if user exists
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
        }

        const payload = {
            user:{
                id: user.id
            }
        }
        
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 3600000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
        );

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
    }
});

module.exports=router;