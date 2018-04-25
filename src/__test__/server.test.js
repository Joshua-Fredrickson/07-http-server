'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
const cowsay = require('cowsay');

beforeAll(() => server.start(5000));
// Josh - this runs prior to my tests on a different
afterAll(() => server.stop());
// Josh - this runs after my tests

describe('VALID request to the API', () => {
  describe('GET /time', () => {
    it('should response with a status of 200', () => {
      return superagent.get(':5000/time')
        .then((res) => {
          // Josh -superagent
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('date');
        });
    });
  });

  describe('GET /cowsayPage', () => {
    const mockCow = cowsay.say({ text: 'Hello World' });
    const mockHtml = `<section><h3><a href="/time">Click here for current time</a></h3><pre>${mockCow}</pre></section>`;
    it('should respond with status 200 and return cow HTML', () => {
      return superagent.get(':5000/cowsayPage')
        .query({ text: 'Hello World' })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.text).toEqual(mockHtml);
        });
    });
  });

  describe('POST /echo', () => {
    it('should return status 200 for successful post', () => {
      return superagent.post(':5000/echo')
        .send({ name: 'jTest' })
        .then((res) => {
          expect(res.body.name).toEqual('jTest');
          expect(res.status).toEqual(200);
        });
    });
  });
});

describe('INVALID request to the API', () => {
  describe('GET /cowsayPage', () => {
    it('Should error out with 400 status code for not sending text in query', () => {
      return superagent.get(':5000/cowsayPage')
        .query({})
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(400);
          expect(err).toBeTruthy();
        });
    });
  });
});

