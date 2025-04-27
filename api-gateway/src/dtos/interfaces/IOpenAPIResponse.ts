export interface IOpenAPIResponse {
  choices: IChoice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: ITokensUsage;
}

export interface IChoice {
  text: string;
  finish_reason: null | string;
  index: number;
}

export interface ITokensUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
