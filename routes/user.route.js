const express = require("express");
const bcrypt = require('bcrypt')
const User = require("../model/User.js");
var jwt = require('jsonwebtoken');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.post('/createUser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const salt = await bcrypt.genSalt();
    let securepass = await bcrypt.hash(req.body.password, salt);
    try {
        await User.create({
            name: req.body.name,
            password: securepass,
            email: req.body.email,
            location: req.body.location
        })
        success = true;
        res.json({ success: success });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
})

router.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, process.env.jwtSecret);
        res.json({ success: true, authToken })
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }
})

module.exports = router;