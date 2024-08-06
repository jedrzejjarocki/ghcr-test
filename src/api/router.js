const {Router} = require('express');
const indexController = require('./controllers')

const router = Router()
  .get('/', indexController.ping)

module.exports = router;
