export interface IJsonCodeComment {
  doc: string;
  description: string;
}

export interface IJsonCode {
  code: number;
  phrase: string;
  constant: string;
  comment: IJsonCodeComment;
  isDeprecated?: boolean;
}
