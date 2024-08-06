const {createUuid} = require("./utils");
const Bugsnag = require("@bugsnag/js");

const SEVERITY = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
}

const log = (severity, message, ctx) => {
  let msg = `LOG.${severity} ${message}`;
  if (ctx) {
    console.log(msg, ctx);
  } else {
    console.log(msg);
  }
}

const logger = {
  info: (message, ctx = null) => log(SEVERITY.INFO, message, ctx),
  warn: (message, ctx = null) => log(SEVERITY.WARN, message, ctx),
  error: (message, ctx = null) => {
    log(SEVERITY.ERROR, message, ctx);
    if (ctx) {
      log(SEVERITY.ERROR, ctx.message, ctx.stack);
      Bugsnag.notify(ctx)
    } else {
      log(SEVERITY.ERROR, 'BUGSNAG not notified');
    }
  },
}

const processMessage = (processName, traceId, message) => `[${processName}] ${traceId} | ${message}`;

const tracedLogger = (processName) => {
  const traceId = createUuid();
  return {
    info: (message, ctx = null) => logger.info(processMessage(processName, traceId, message), ctx),
    warn: (message, ctx = null) => logger.warn(processMessage(processName, traceId, message), ctx),
    error: (message, ctx = null) => logger.error(processMessage(processName, traceId, message), ctx),
  }
}

module.exports = {
  tracedLogger,
  logger,
}
