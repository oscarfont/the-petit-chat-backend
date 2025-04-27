import ChatMessageResponse from './dtos/classes/ChatMessageResponse';
import HttpClient from './infrastructure/http/HttpClient';
import LocalLlmClient from './infrastructure/LocalLlmClient';

export const generateCompletions = async (
  message: string,
): Promise<ChatMessageResponse> => {
  const httpClient = new HttpClient();
  const localLlmClient = new LocalLlmClient(httpClient);

  try {
    return await localLlmClient.generate(message);
  } catch (e) {
    throw e;
  }
};
