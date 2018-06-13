const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../../models/User');
const validationRegister = require('../../validation/register');
const validationLogin = require('../../validation/login');

require('dotenv').config();

// Register new User
router.post('/register', (req, res) => {
    const { err, isValid } = validationRegister(req.body);

    // isValid check return err
    if (!isValid){
        return res.status(400).json(err)
    }

    User.findOne({email: req.body.email})
        .then(user => {
            // check if email already exist
            if (user) {
                err.email = 'Email already exist';
                return res.status(400).json(err)
            } else {
                // create new User
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // size
                    r: 'pg', // rating
                    d: 'mm' // Default
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
});

// Login User
router.post('/login', (req, res) => {
    const { err, isValid } = validationLogin(req.body);

    // isValid check return err
    if (!isValid){
        return res.status(400).json(err)
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            // check if email not found
            err.email = 'Email not found!';
            if (!user) return res.status(404).json(err);

            // compare password user
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    // check if is match then create payload
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        };

                        // jwt sign
                        jwt.sign(
                            payload,
                            process.env.SECRET_KEY,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                })
                            });
                    } else {
                        err.password  = 'Password incorrect';
                        res.status(400).json(err)
                    }
                })
        })
});

// current user
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req,res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        })
});

module.exports = router;