const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

router.get('/test', (req, res) => {
    res.json({
        message: 'Posts works'
    })
});

module.exports = router;