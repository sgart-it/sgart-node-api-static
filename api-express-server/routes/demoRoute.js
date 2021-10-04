var express = require('express');

const router = express.Router();

router.get('/', function (req, res, next) {
  var param = req.body;
  console.log('get param:', param);

  const content = {
    date: new Date(),
    param: param,
    server: 'espress'
  };
  console.log('content:', content);

  res.send('OK Runnig express');
});

router.post('/', function (req, res, next) {
  var param = req.body;
  console.log('post param:', param);

  const content = {
    date: new Date(),
    param: param,
    server: 'espress'
  };
  console.log('content:', content);

  res.json(content);
});

module.exports = router;
