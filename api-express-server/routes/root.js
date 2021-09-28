var express = require('express');
const cors = require("cors");

var router = express.Router();

/* GET users listing. */
router.post('/', cors(), function (req, res, next) {
  var param = req.body;
  console.log('param:', param);

  const content = {
    date: new Date(),
    param: param
  };
  console.log('content:', content);

  res.json(content);
});

module.exports = router;
