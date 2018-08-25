const express = require('express');
const router = express.Router();

//because we're in the route, doing '/test' is actually 'api/users/test'

//@route        GET api/profile/test
//@description  tests profile route
//@access       public
router.get('/test', (req, res) => {
  res.json({
    message: 'Profile works!'
  });
});

module.exports = router;