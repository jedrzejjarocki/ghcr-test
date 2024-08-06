const chain = require("./constants/chain");
const ERROR_CODE = require("./constants/error");
const ValidationError = require("./errors/ValidationError");
const WALLET_TYPE = require("./constants/walletType");
const Web3 = require('./connections/web3');
const {ethers} = require("ethers");

const isValidErc20ContractAddress = chain => address => {
  const w3 = new Web3(chain);
  return w3.isErc20Contract(address);
}
const isValidAddress = address => {
  const isValid = new Web3().isAddress(address);
  if (isValid) return;
  throw new ValidationError(ERROR_CODE.INVALID_ADDRESS, 'Address is not a valid address');
}

const isValidChain = input => {
  const isValid = chain.name.toUpperCase() === input?.toUpperCase();
  if (isValid) return;
  throw new ValidationError(ERROR_CODE.UNSUPPORTED_CHAIN, JSON.stringify(chain));
}

const required = value => {
  if (value !== undefined && value !== null) return;
  throw new ValidationError(ERROR_CODE.REQUIRED, 'Field is required');
}

const isValidWalletType = type => {
  const isValid = !!WALLET_TYPE[type?.toUpperCase()];
  if (isValid) return;
  throw new ValidationError(ERROR_CODE.INVALID_WALLET_TYPE, 'Provided wallet type is not valid');
}

const isValidAmount = decimals => value => {
  try {
    ethers.parseUnits(value, decimals);
  } catch (e) {
    if (e instanceof RangeError) {
      throw new ValidationError(ERROR_CODE.INVALID_AMOUNT, 'Provided amount is not valid')
    }
  }
  return true;
}

const isValidBoolean = value => {
  const isValid = value === true || value === false;
  if (isValid) return;
  throw new ValidationError(ERROR_CODE.INVALID_BOOLEAN, 'Provided value has to be true or false (boolean)')
}

const validate = (data, rules) => {
  const errors = Object.entries(rules).reduce((err, [field, validators]) => {
    const fieldErrors = validators.map(validator => {
      try {
        validator(data[field])
      } catch (e) {
        if (e instanceof ValidationError) {
          return {
            code: e.code,
            message: e.message,
          }
        }
        throw e;
      }
      return null;
    }).filter(Boolean);

    const ret = {...err};
    if (fieldErrors.length) ret[field] = fieldErrors;
    return ret;
  }, {});
  const hasErrors = !!Object.keys(errors).length;
  if (hasErrors) {
    throw new ValidationError(ERROR_CODE.VALIDATION_ERROR, 'Validation failed', errors);
  }

  return Object.keys(rules).reduce((ret, field) => ({...ret, [field]: data[field]}), {});
}

module.exports = {
  isValidAddress,
  isValidChain,
  isValidAmount,
  isValidBoolean,
  isValidWalletType,
  isValidErc20ContractAddress,
  required,
  validate,
}
