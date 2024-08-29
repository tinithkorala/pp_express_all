const colorLogger = (text, level) => {
  const log = console.log;
  const message = `➜➜➜➜➜ ${text}`;
  import("chalk").then(({ default: chalk }) => {
    switch (level) {
      case "success":
        log(chalk.green.bold(`🟢 ${message}`));
        break;

      case "warning":
        log(chalk.yellow.bold(`🟡 ${message}`));
        break;

      case "error":
        log(chalk.red.bold(`🔴 ${message}`));
        break;

      case "special":
        log(chalk.magenta.bold(`🟣  ${message}`));
        break;

      default:
        log(chalk.white.bold(`⚪ ${message}`));
    }
  });
};

module.exports = colorLogger;
