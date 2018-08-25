const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const db = require('./config/keys').mongoURI;
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected.'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('hello there yo');
});

//use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => {
  console.log(`Server running on port ${port}.`)
});