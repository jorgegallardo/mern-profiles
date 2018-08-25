const express = require('express');
const router = express.Router();

//because we're in the route, doing '/test' is actually 'api/users/test'

//@route        GET api/users/test
//@description  tests users route
//@access       public
router.get('/test', (req, res) => {
  res.json({
    message: 'Users works!'
  });
});

module.exports = router;