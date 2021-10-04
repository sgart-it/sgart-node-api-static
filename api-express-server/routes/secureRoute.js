var express = require('express');

const router = express.Router();

router.get('/protected-data', (req, res, next) => {
  try {
    res.json({
      text: "frase segreta da mostrare solo a chi è autenticato",
      date: new Date()
    });
  }
  catch (error) {
    console.error(error, "ProtectedData error");
    res.json({ error: error });
  }
});

module.exports = router;
