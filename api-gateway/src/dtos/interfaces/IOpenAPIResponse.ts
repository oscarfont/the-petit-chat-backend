export interface IOpenAPIResponse {
  choices: IChoice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: ITokensUsage;
}

export interface IChoice {
  message: IDelta;
  finish_reason: null | string;
  index: number;
}

export interface IDelta {
  role: string;
  content: string;
}

export interface ITokensUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
