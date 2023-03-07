const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('config');
const { body, validationResult } = require('express-validator');

const User = require("../../models/User");

// @route  POST api/users
// @desc   Register Route
// @access Public
router.post("/",

    body("name", "Name is required").not().isEmpty(),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a password with 6 or more characters").isLength({min: 6}),
async (req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    const {name, email, password} = req.body;

    try {
        // See if user exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({errors: [{msg: 'User already exists'}]});
        }
    
        // Get users gravatar
        const avatar = gravatar.url(email,{
            s: '200', // size
            r: 'pg', // rating
            d: 'mm' // default
        })

        user = new User({
            name,
            email,
            avatar,
            password
        });
    
        // Encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
    
        // return jsonwebtoken
        /*
        1. User sign-in using username and password or google/facebook.
        2. Authentication server verifies the credentials and issues a jwt signed using either a secret salt or a private key.
        3. User's Client uses the JWT to access protected resources by passing the JWT in HTTP Authorization header.
        4. Resource server then verifies the authenticity of the token using the secret salt/ public key.
        */


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