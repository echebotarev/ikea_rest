const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/kaspi-kz', async (req, res) => {
  const file = path.join(__dirname, '../static/kaspi-kz-feed.xml');
  return res.download(file);
});

module.exports = router;
