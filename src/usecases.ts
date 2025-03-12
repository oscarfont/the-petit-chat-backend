import ChatMessageResponse from './dtos/classes/ChatMessageResponse';
import OllamaClient from './infrastructure/OllamaClient';

export const generateCompletions = async (
  message: string,
): Promise<ChatMessageResponse> => {
  // const httpClient = new HttpClient();
  // const openAIClient = new OpenAIClient(httpClient);
  const ollamaClient = new OllamaClient();

  try {
    return await ollamaClient.generate(message);
  } catch (e) {
    throw e;
  }
};
