var express = require('express');
const cors = require("cors");

var router = express.Router();



router.get('/', cors(), function (req, res, next) {
  var param = req.body;
  console.log('param:', param);

  const content = {
    date: new Date(),
    param: param,
    server: 'espress'
  };
  console.log('content:', content);

  res.send('OK Runnig express');
});

router.post('/', cors(), function (req, res, next) {
  var param = req.body;
  console.log('param:', param);

  const content = {
    date: new Date(),
    param: param,
    server: 'espress'
  };
  console.log('content:', content);

  res.json(content);
});

module.exports = router;
