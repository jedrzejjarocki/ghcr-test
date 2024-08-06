const ValidationError = require("./ValidationError");
const {APP_ENVIRONMENT} = require("../config");
const InvalidStateError = require("./InvalidStateError");
const NotFoundError = require("./NotFoundError");
const InsufficientFundsError = require("./InsufficientFundsError");

const errorHandler = (err, req, res, _) => {
  let status = 500;
  let json = {
    message: APP_ENVIRONMENT === 'production' ? `Something went wrong: ${err.message}` : err.message,
  };

  if (err instanceof ValidationError) {
    status = 401;
    json = err.toJSON();
  }

  if(err instanceof InvalidStateError) {
    status = 400;
  }

  if(err instanceof InsufficientFundsError) {
    status = 400;
  }

  if(err instanceof NotFoundError) {
    status = 404;
  }

  res.status(status).json({status: 'ERROR', ...json});
};

module.exports = errorHandler;
