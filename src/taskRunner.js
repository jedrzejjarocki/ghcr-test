const {logger} = require("./logging");

function createTaskRunner(task, timeoutDuration, taskName,  maxRuns = Infinity) {
  let runCount = 0;
  let isShuttingDown = false;

  async function someTask() {
    // Ensure someTask doesn't run concurrently
    if (isShuttingDown) {
      logger.info(`[TASK] ${taskName} - Skipping execution during shutdown...`);
      return;
    }

    try {
      // Your long-running task goes here
      logger.info(`[TASK] ${taskName} Starting...`);
      await task();
      logger.info(`[TASK] ${taskName} completed.`);
      runCount++;

      if (runCount >= maxRuns) {
        logger.info(`[TASK] ${taskName} Maximum runs reached. Stopping the task.`);
        shutdown();
      }
    } catch (error) {
      logger.error(`[TASK] Error in ${taskName}:`, error);
      shutdown();
    }
  }

  async function runAndSchedule() {
    await someTask();
    if (!isShuttingDown && runCount < maxRuns) {
      setTimeout(runAndSchedule, timeoutDuration);
    }
  }

  function shutdown() {
    if (isShuttingDown) return;

    isShuttingDown = true;
    console.log(`[TASK] ${taskName} Shutting down gracefully... Waiting for current operation to complete.`);

    // Optionally, you can add cleanup or finalization steps here before exiting
    // For now, let's just exit after a short delay
    setTimeout(() => {
      console.log(`[TASK] ${taskName} Exiting...`);
      process.exit(0);
    }, 2000); // Wait for 2 seconds before force exiting (adjust as needed)

    // You might also want to handle other cleanup tasks here
  }

  // Listen for termination signals
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Initial trigger
  return {
    start: runAndSchedule,
    shutdown
  };
}

module.exports = createTaskRunner;
