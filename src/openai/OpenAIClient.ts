import { AxiosRequestConfig } from "axios";
import { httpClient } from "../adapters/http/httpClientInterface";
import ChatMessageResponse from "../dtos/classes/ChatMessageResponse";
import { openAIAPIResponse } from "../dtos/interfaces/openAPIResponse";
import { MessageRole, messages } from "./KnowledgeBase";
import { openAIClient } from "./openAIClientInterface";

class OpenAIClient implements openAIClient {
  public endpointURL = "https://api.openai.com/v1/chat/completions";
  private readonly httpClient: httpClient;
  private readonly apiKey: string;

  constructor(private client: httpClient) {
    this.httpClient = client;
    this.apiKey = process.env.API_KEY ? process.env.API_KEY : "";
  }

  apiKeyIsNotEmpty(): Boolean {
    return this.apiKey !== undefined && this.apiKey.length > 0;
  }
  parseResponse(response: openAIAPIResponse): ChatMessageResponse {
    const message = new ChatMessageResponse();
    message.fromOpenAPIResponse(response);
    return message;
  }

  async generate(message: string): Promise<ChatMessageResponse> {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      };
      const body = {
        model: "gpt-3.5-turbo",
        messages: [...messages, { role: MessageRole.USER, content: message }],
        temperature: 0.5,
      };
      const response = await this.httpClient.post<openAIAPIResponse>(
        this.endpointURL,
        body,
        config
      );
      return this.parseResponse(response);
    } catch (e) {
      throw e;
    }
  }
}

export default OpenAIClient;
