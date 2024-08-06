require('dotenv').config();

const APP_ENVIRONMENT = process.env.APP_ENVIRONMENT || 'local';

const DB = {
  HOST: process.env.DB_HOST || 'mariadb',
  PORT: process.env.DB_PORT || 3306,
  CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT || null,
  USER: process.env.DB_USER || null,
  PASSWORD: process.env.DB_PASSWORD || null,
  NAME: 'evm_node_tools',
}

const API = {
  PORT: 3000,
}

const AUTH = {
  JWT_SECRET: process.env.AUTH_TOKEN_SECRET,
  IS_DISABLED: process.env.AUTH_IS_DISABLED || 'no',
  TOKEN_EXPIRATION_TIME: process.env.AUTH_TOKEN_EXPIRATION_TIME || 600,
}

const BUGSNAG_API_KEY = process.env.BUGSNAG_API_KEY || null;

module.exports = {
  APP_ENVIRONMENT,
  DB,
  API,
  AUTH,
  BUGSNAG_API_KEY,
}
