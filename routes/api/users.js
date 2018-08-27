const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//because we're in the route, doing '/test' is actually 'api/users/test'
//route        GET api/users/test
//description  tests users route
//access       public
router.get('/test', (req, res) => {
  res.json({
    message: 'Users works!'
  });
});

//route        POST api/users/register
//description  register new user
//access       public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //check validation
  if(!isValid) {
    return res.status(400).json(errors);
  }

  //https://mongoosejs.com/docs/models.html
  User.findOne({ email: req.body.email })
    .then(user => {
      if(user) {
        errors.email = 'Email already exists.';
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      }
    })
    .catch(err => console.log(err));
});

//route        POST api/users/login
//description  login user, return JWT
//access       public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  //check validation
  if(!isValid) {
    return res.status(400).json(errors);
  }

  //browser sends a form that has email and password in the form of req.body
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email})
    .then(user => {
      if(!user) {
        errors.email = 'User not found.';
        return res.status(404).json(errors);
      }
      bcrypt.compare(password, user.password)
        .then((passwordMatch) => {
          if(passwordMatch) {
            //password matched, create payload
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };
            //generate token
            //https://www.npmjs.com/package/jsonwebtoken
            //jwt.sign(payload, secretOrPrivateKey, [options, callback])
            // (Asynchronous) If a callback is supplied, the callback is called with the err or the JWT.
            // (Synchronous) Returns the JsonWebToken as string
            jwt.sign(
              payload,
              keys.secretOrPrivateKey,
              { expiresIn: 3600 },
              (err, token) => {
                return res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              }
            );
            //res.json({ message: 'Passwords match.'});
          } else {
            errors.password = 'Incorrect password.';
            return res.status(400).json(errors);
          }
        });
    })
    .catch(err => console.log(err));
})

//route        POST api/users/current
//description  return current user
//access       private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;