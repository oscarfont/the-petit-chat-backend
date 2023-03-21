import HttpClient from "./adapters/http/HttpClient";
import ChatMessageResponse from "./dtos/classes/ChatMessageResponse";
import OpenAIClient from "./openai/OpenAIClient";

export const generateCompletions = async (
  message: string
): Promise<ChatMessageResponse> => {
  const httpClient = new HttpClient();
  const openAIClient = new OpenAIClient(httpClient);

  try {
    const response = await openAIClient.generate(message);
    return response;
  } catch (e) {
    throw e;
  }
};
