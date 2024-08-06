const crypto = require("crypto");
const {v4} = require('uuid');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const generateJwtSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

const bigIntReplacer = (key, value) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}


const createUuid = () => v4();

module.exports = {
  sleep,
  createUuid,
  bigIntReplacer,
}
