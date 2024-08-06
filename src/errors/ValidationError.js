class ValidationError extends Error {
  constructor(code, message = null, errors = null) {
    super(message);
    this.code = code;
    this.errors = errors;
  }

  toJSON() {
    const json = {code: this.code}
    if(this.message) json.message = this.message;
    if(this.errors) json.errors = this.errors;
    return json;
  }
}

module.exports = ValidationError;
