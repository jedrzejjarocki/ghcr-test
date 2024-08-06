const listen = require("./api/listen");
const {logger} = require("./logging");
const Bugsnag = require('@bugsnag/js')
const BugsnagPluginExpress = require('@bugsnag/plugin-express');
const createTaskRunner = require("./taskRunner");
const {BUGSNAG_API_KEY} = require("./config");

if (BUGSNAG_API_KEY) {
  Bugsnag.start({
    apiKey: BUGSNAG_API_KEY,
    plugins: [BugsnagPluginExpress]
  })
}

const [_, __, command] = process.argv;

const actions = {
  listen,
};

logger.info('APPLICATION STARTED with command: ', command);

const action = actions[command] || actions.listen;

if (!action) {
  logger.info(`Invalid command: ${command}`);
  logger.info(`choose one of: \n${Object.keys(actions).join('\n')}`)
  process.exit(1);
}

action();
