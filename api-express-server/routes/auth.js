const express = require('express');
const cors = require("cors");
const authService = require('../services/auth-service');

const router = express.Router();


router.post('/login', cors(), function (req, res, next) {
  console.log('**********************************');
  const param = req.body;
  console.log('param:', param);

  const result = {
    token: null,
    valid: false
  };

  try {
    const token = authService.getJwtToken(param.userName, param.password);

    result.token = token;
    result.valid = token !== null;
  } catch (error) {
    console.log(error, "Login error");
    result.token = null;
    result.valid = false;
  }

  res.json(result);
});

router.post('/validate', cors(), function (req, res, next) {
  const param = req.body;
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
