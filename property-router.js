const service = require('node-js-properties-service');
var express = require('express');
const lodash = require('lodash');

var propertyRouter = express.Router();

propertyRouter.get('/', (req, res, next) => {
  service.getAllPropertyListing().then((properties) => {
    res.send({properties});
  }).catch(next);
});

propertyRouter.get('/:id', (req, res, next) => {
  var id = req.params.id;
  service.getPropertyListing(id).then((properties) => {
    if (!properties) {
      res.status(400);
    }
    res.send({properties});
  }).catch(next);
});

propertyRouter.post('/zoopla/importPageOne', (req, res, next) => {

  service.zooplaImportPageOne().then((result) => {
    res.send({result});
  }).catch(next);
});

propertyRouter.post('/zoopla/import', (req, res, next) => {
  service.zooplaImport().then((result) => {
    res.send({result});
  }).catch(next);
});

propertyRouter.post('/', (req, res, next) => {
  var body = lodash.pick(req.body, ['listingId', 'price']);
  service.addProperty(body).then((result) => {
    if (!result) {
      res.status(400);
    }
    res.send(result);
  }).catch(next);
});

propertyRouter.put('/:id', (req, res, next) => {
  var id = req.params.id;
  var body = lodash.pick(req.body, ['listingId', 'price']);
  service.updateProperty(id, body).then((result) => {
    if(!result) {
      res.status(400).send('Could not update property');
    }
    res.send({result});
  }).catch(next);
});

propertyRouter.delete('/:id', (req, res, next) => {
  var id = req.params.id;
  service.deleteProperty(id).then((result) => {
    if(!result) {
      res.status(400).send('Could not delte property');
    }
    res.send({result, status: "deleted"});
  }).catch(next);
});

module.exports = propertyRouter;
