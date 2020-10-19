const express = require('express');
const builder = require('xmlbuilder');
const Client = require('./../libs/mongoClient');

const router = express.Router();

router.get('/yml', async (req, res) => {
  const d = new Date();
  const minutes = d.getMinutes();

  let xml = builder.begin()
    .ele(
      'yml_catalog', {
        date:
          `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${minutes < 10 ? `0${minutes}` : minutes}`
      }
    )
      .ele('xmlbuilder');

  for (let i = 1; i <= 3; i++) {
    xml.ele('person', { id: i });
  }

  xml.end({ pretty: true });

  console.log(xml);

  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

module.exports = router;
