export class GenericErrMessages {
  static readonly STATUS_CODE_DOES_NOT_EXIST = (
    statusCode: (number | string),
  ): string => `Status code does not exist: ${statusCode}`;

  static readonly REASON_PHRASE_DOES_NOT_EXIST = (
    reasonPhrase: (string),
  ): string => `Reason phrase does not exist: ${reasonPhrase}`;
}
