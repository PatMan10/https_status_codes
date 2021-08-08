export interface JsonCodeComment {
  doc: string;
  description: string;
}

export interface JsonCode {
  code: number;
  phrase: string;
  constant: string;
  comment: JsonCodeComment;
  isDeprecated?: boolean;
}
