import { Logger, path } from "../../../deps/dev.ts";

export const logger = new Logger();

export class ErrorMessages {
  static readonly URL_TOO_SHORT = "URL is too short.";
}

export function currentModuleDir(url: string): string {
  if (url.length <= 7) {
    throw new Error(ErrorMessages.URL_TOO_SHORT);
  }
  return path.dirname(url.substring(7));
}
