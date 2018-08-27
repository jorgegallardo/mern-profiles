const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const passport = require('passport');

//load router modules
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

//body parser middleware
app.use(bodyParser.urlencoded({urlencoded: false}));
app.use(bodyParser.json());

//db connection
const db = require('./config/keys').mongoURI;
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected.'))
  .catch((err) => console.log(err));

//https://www.npmjs.com/package/passport
//https://www.npmjs.com/package/passport-jwt
//passport middleware
app.use(passport.initialize());
//passport config
require('./config/passport')(passport);

//use routes
//https://expressjs.com/en/guide/routing.html
//https://stackoverflow.com/questions/28305120/differences-between-express-router-and-app-get
//https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => {
  console.log(`Server running on port ${port}.`)
});