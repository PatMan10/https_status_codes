import { path } from "../../../../../deps/dev.ts";
//--------------------------------------------------
import { GenericErrMessages } from "../classes/constants/error-messages.ts";

export const currentModuleDir = (url: string): string => {
  if (url.length <= 7) {
    throw new Error(GenericErrMessages.URL_TOO_SHORT);
  }
  return path.dirname(url.substring(7));
};
