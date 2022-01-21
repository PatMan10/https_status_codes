import { path } from "../../../deps/dev.ts";

export class ErrorMessages {
  static readonly URL_TOO_SHORT = "URL is too short.";
}

export const currentModuleDir = (url: string): string => {
  if (url.length <= 7) {
    throw new Error(ErrorMessages.URL_TOO_SHORT);
  }
  return path.dirname(url.substring(7));
};

