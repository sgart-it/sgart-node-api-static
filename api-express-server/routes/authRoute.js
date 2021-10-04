const express = require('express');
const authService = require('../services/authService');

const router = express.Router();

router.post('/login', (req, res, next) => {
  const param = req.body;
  console.log('login param:', param);

  const result = {
    token: null,
    valid: false
  };

  try {
    const token = authService.getJwtToken(param.username, param.password);

    result.token = token;
    result.valid = token !== null;
  } catch (error) {
    console.log(error, "Login error");
    result.token = null;
    result.valid = false;
  }

  res.json(result);
});

router.post('/validate', (req, res, next) => {
  const param = req.body;
  console.log('param:', param);

  const result = {
    valid: false
  };

  try {
    result.valid = authService.verifyJwtToken(param.token);
  } catch (error) {
    console.error('validate', error);
    result.valid = false;
  }

  res.json(result);
});

module.exports = router;
