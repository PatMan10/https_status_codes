import {
  reasonPhraseToStatusCode,
  statusCodeToReasonPhrase,
} from "./records.ts";

/**
 * Returns the reason phrase for the given status code.
 * If the given status code does not exist, an error is thrown.
 *
 * @param {number|string} statusCode The HTTP status code
 * @returns {string} The associated reason phrase (e.g. "Bad Request", "OK")
 */
export function getReasonPhrase(statusCode: (number | string)): string {
  const result = statusCodeToReasonPhrase[statusCode.toString()];
  if (!result) {
    throw new Error(ErrorMessages.STATUS_CODE_DOES_NOT_EXIST(statusCode));
  }
  return result;
}

/**
 * Returns the status code for the given reason phrase.
 * If the given reason phrase does not exist, undefined is returned.
 *
 * @param {string} reasonPhrase The HTTP reason phrase (e.g. "Bad Request", "OK")
 * @returns {string} The associated status code
 */
export function getStatusCode(reasonPhrase: string): number {
  const result = reasonPhraseToStatusCode[reasonPhrase];
  if (!result) {
    throw new Error(
      ErrorMessages.REASON_PHRASE_DOES_NOT_EXIST(reasonPhrase),
    );
  }
  return result;
}

export class ErrorMessages {
  static readonly STATUS_CODE_DOES_NOT_EXIST = (
    statusCode: (number | string),
  ): string => `Status code does not exist: ${statusCode}`;

  static readonly REASON_PHRASE_DOES_NOT_EXIST = (
    reasonPhrase: (string),
  ): string => `Reason phrase does not exist: ${reasonPhrase}`;
}
