import { AxiosRequestConfig } from 'axios';
import {IAgentClient} from '../domain/IAgentClient';
import { MessageRole, messages } from '../domain/KnowledgeBase';
import ChatMessageResponse from '../dtos/classes/ChatMessageResponse';
import { IOpenAPIResponse } from '../dtos/interfaces/IOpenAPIResponse';
import { IHttpClient } from './http/IHttpClient';

class OpenAIClient implements IAgentClient {
  public endpointURL = 'https://api.openai.com/v1/chat/completions';
  private readonly httpClient: IHttpClient;
  private readonly apiKey: string;

  constructor(private client: IHttpClient) {
    this.httpClient = client;
    this.apiKey = process.env.API_KEY ? process.env.API_KEY : '';
  }

  public apiKeyIsNotEmpty(): boolean {
    return this.apiKey !== undefined && this.apiKey.length > 0;
  }
  public parseResponse(response: IOpenAPIResponse): ChatMessageResponse {
    const message = new ChatMessageResponse();
    message.fromOpenAPIResponse(response);
    return message;
  }

  public async generate(message: string): Promise<ChatMessageResponse> {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
      };
      const body = {
        model: 'gpt-4o',
        messages: [...messages, { role: MessageRole.USER, content: message }],
        temperature: 0.5,
      };
      const response = await this.httpClient.post<IOpenAPIResponse>(
        this.endpointURL,
        body,
        config,
      );
      return this.parseResponse(response);
    } catch (e) {
      throw e;
    }
  }
}

export default OpenAIClient;
