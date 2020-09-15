const express = require('express');
const router = express.Router();

router.get('/backup', (req, res) => {
  const dbFile = `./sqlite.db`;
  res.download(dbFile);
});

module.exports = router;
