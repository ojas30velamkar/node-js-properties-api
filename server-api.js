const express = require('express');
const bodyParser = require('body-parser');
const service = require('node-js-properties-service');
const lodash = require('lodash');

var app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.get('/zoopla/properties', (req, res) => {
  service.getZooplaPropertyListings().then((property) => {
    res.send({property});
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/properties', (req, res) => {
  service.getAllPropertyListing().then((properties) => {
    res.send({properties});
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/properties/:id', (req, res) => {
  var id = req.params.id;
  service.getPropertyListing(id).then((properties) => {
    if (!properties) {
      res.status(400);
    }
    res.send({properties});
  }, (e) => {
    res.status(400).send(e);
  })
});

app.post('/properties/zoopla/importPageOne', (req, res) => {
  service.zooplaImportPageOne().then((result) => {
    res.send({result});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.post('/properties/zoopla/import', (req, res) => {
  service.zooplaImport().then((result) => {
    res.send({result});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.post('/properties', (req, res) => {
  var body = lodash.pick(req.body, ['listingId', 'price']);
  service.addProperty(body).then((result) => {
    if (!result) {
      res.status(400);
    }
    res.send(result);
  });
});

app.put('/properties/:id', (req, res) => {
  var id = req.params.id;
  var body = lodash.pick(req.body, ['listingId', 'price']);
  service.updateProperty(id, body).then((result) => {
    if(!result) {
      res.status(400).send('Could not update property');
    }
    res.send({result});
  });
});

app.delete('/properties/:id', (req, res) => {
  var id = req.params.id;
  service.deleteProperty(id).then((result) => {
    if(!result) {
      res.status(400).send('Could not delte property');
    }
    res.send({result, status: "deleted"});
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
