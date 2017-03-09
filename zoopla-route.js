const service = require('node-js-properties-service');
var express = require('express');
var zooplaRouter = express.Router();

zooplaRouter.get('/properties', (req, res) => {
  service.getZooplaPropertyListings().then((property) => {
    res.send({property});
  }, (e) => {
    res.status(400).send(e);
  })
});

module.exports = zooplaRouter;
