const expect = require('expect');
const request = require('supertest');
const lodash = require('lodash');

const {app} = require('./../server-api');

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
