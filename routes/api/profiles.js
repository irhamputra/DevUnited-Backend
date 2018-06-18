const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

router.get(
    '/',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const err = {};

        Profile.findOne({user: req.user.id})
            .then(profile => {
                if (!profile) {
                    err.noprofile = 'Profile not found for this user';
                    return res.status(404).json(err)
                }

                res.json(profile)
            })
            .catch(err => res.status(404).json(err));
    });

router.post('/', (req, res) => {

    // TODO: Field handling form
    const profileFields = {};
    const err = {};

    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.github) profileFields.github = req.body.github;

    if (typeof req.body.skills !== 'undefined')
        profileFields.handle = req.body.skills.split(',');

    profileFields.social = {};
    if (req.body.facebook) profileFields.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.instagram = req.body.instagram;
    if (req.body.dribbble) profileFields.dribbble = req.body.dribbble;

    // TODO: Update & Confirm  => POSTMAN
    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (profile) {
                profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                    ).then(profile => res.json(profile))
            } else {
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if (profile) {
                            err.handle = 'That handle is already exist';
                            res.status(400).json(err)
                        }
                    });
            }
        })
});


module.exports = router;