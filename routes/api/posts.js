const express = require('express');
const router = express.Router();

//because we're in the route, doing '/test' is actually 'api/users/test'

//@route        GET api/posts/test
//@description  tests posts route
//@access       public
router.get('/test', (req, res) => {
  res.json({
    message: 'Posts works!'
  });
});

module.exports = router;