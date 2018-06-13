const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const posts = require('./routes/api/posts');

require('dotenv').config();

const MongoUri = process.env.MONGO_URI;
if (!MongoUri) throw new Error('Please provide Mongo URI');
mongoose
    .connect(MongoUri)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts);

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));