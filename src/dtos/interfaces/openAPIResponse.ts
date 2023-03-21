export interface openAIAPIResponse {
  choices: Choice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: TokensUsage;
}

export interface Choice {
  message: Delta;
  finish_reason: null | string;
  index: number;
}

export interface Delta {
  role: string;
  content: string;
}

export interface TokensUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
