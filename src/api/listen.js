const express = require('express')
const {API} = require('../config')
const router = require("./router");
const jwtAuthorization = require('../middleware/jwtAuthorization')
const errorHandler = require("../errors/errorHandler");
const {logger} = require("../logging");
const {getPlugin} = require("@bugsnag/js");

const listen = () => {
  const app = express();
  const bugsnag = getPlugin('express');
  if(bugsnag) {
    app.use(bugsnag.requestHandler)
  }
  app.use(express.json());
  app.use(jwtAuthorization)
  app.use('/', router);
  app.use(errorHandler)
  if(bugsnag) {
    app.use(bugsnag.errorHandler)
  }  
  app.listen(API.PORT, () => logger.info(`Listening on port ${API.PORT}`))
}

module.exports = listen;
