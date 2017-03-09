const expect = require('expect');
const request = require('supertest');
const lodash = require('lodash');
var assert = require('chai').assert;

const {app} = require('./../server-api');
const service = require('node-js-properties-service');

beforeEach((done) => {
  service.deleteAllProperties().then((result) => {
    return done();
  });
});

describe('POST /properties', () => {
  it('should create a new property', (done) => {
    var property = {
      "listingId": "9999",
      "price": 999
    };
    request(app)
      .post('/properties')
      .send(property)
      .expect(200)
      .expect((res) => {
        expect(res.body).toInclude(property);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('should not create a property if invalid data is sent', (done) => {
    var property = {
      "price": 999
    };

    request(app)
      .post('/properties')
      .send(property)
      .expect(400)
      .end((err, res) => {
        return done(err);
      });
  });
});

describe('POST /properties/zoopla/import', () => {
  it('should import all the properties from Zoopla', (done) => {
    request(app)
      .post('/properties/zoopla/import')
      .expect(200)
      .expect((res) => {
        console.log(res.body);
      })
      .end((err, res) => {
        if (err) {
          console.log('err', err);
          return done(err);
        }
        service.getAllPropertyListing().then((properties) => {
          assert.equal(properties.length, 300);
          return done();
        }).catch((e) => done(e));

      });
  });
});

describe('GET /properties/:id', () => {
  it('should fetch the property for a Id', (done) => {
    var propertyData = {
      "listingId": "9879",
      "price": 999
    };
    service.addProperty(propertyData).then((result) => {
      if (result) {
        request(app)
          .get(`/properties/${result._id}`)
          .expect(200)
          .expect((res) => {
            assert.equal(res.body.properties.listingId, "9879");
            assert.equal(res.body.properties.price, 999);
          })
          .end((err, res) => {
            if (err) {
              console.log('err', err);
              return done(err);
            }
            return done();
          });
      }
    }).catch((e) => done(e));
  });
});

describe('PUT /properties/:id', () => {
  it('should update the property for a Id', (done) => {
    var propertyData = {
      "listingId": "9879",
      "price": 999
    };
    service.addProperty(propertyData).then((result) => {
      if (result) {
        var updateProperty = {
          "listingId": "5555",
          "price": 555
        };

        request(app)
          .put(`/properties/${result._id}`)
          .send(updateProperty)
          .expect(200)
          .expect((res) => {
            assert.equal(res.body.result.listingId, "5555");
            assert.equal(res.body.result.price, 555);
          })
          .end((err, res) => {
            if (err) {
              console.log('err', err);
              return done(err);
            }
            return done();
          });
      }
    }).catch((e) => done(e));
  });
});

describe('DELETE /properties/:id', () => {
  it('should delete the property for a Id', (done) => {
    var propertyData = {
      "listingId": "9879",
      "price": 999
    };
    service.addProperty(propertyData).then((result) => {
      if (result) {
        request(app)
          .delete(`/properties/${result._id}`)
          .expect(200)
          .expect((res) => {
            assert.equal(res.body.result.listingId, "9879");
            assert.equal(res.body.result.price, 999);
            assert.equal(res.body.status, "deleted");
          })
          .end((err, res) => {
            if (err) {
              console.log('err', err);
              return done(err);
            }
            service.getPropertyListing(res.body.result._id).then((property) => {
              assert.isNull(property, 'property is null');
              return done();
            }).catch((e) => done(e));
          });
      }
    }).catch((e) => done(e));
  });
});
