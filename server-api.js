const express = require('express');
const service = require('node-js-properties-service');
const bodyParser = require('body-parser');
const logger = require('morgan');

const zooplaRouter = require('./zoopla-route');
const propertyRouter = require('./property-router');

var app = express();
const port = process.env.PORT || 3000;
app.use(logger());
app.use(bodyParser.json());
app.use('/zoopla', zooplaRouter);
app.use('/properties',propertyRouter);
app.use((error, req, res, next) => {
  if(!error) {
    next();
    return;
  }
  console.error('Error', error);
  res.status(500).send({error: error.message});
})


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
