import chalk from "chalk";

export function debug(message: string) {
  console.log(chalk.blue(`[DEBUG] ${message}`));
}

export function error(message: string, error: unknown) {
  console.error(chalk.red(`[ERROR] ${message}`));
}

export function backend(message: string) {
  console.log(chalk.cyan(`[BACKEND] ${message}`));
}

export function database(message: string) {
  console.log(chalk.green(`[DATABASE] ${message}`));
}

export function xmpp(message: string) {
  console.log(chalk.cyanBright(`[XMPP] ${message}`));
}

export function bot(message: string) {
  console.log(chalk.greenBright(`[BOT] ${message}`));
}

export default {
  debug,
  error,
  backend,
  database,
  xmpp,
  bot,
};
