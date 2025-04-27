import {AxiosRequestConfig} from 'axios';
import {IAgentClient} from '../domain/IAgentClient';
import {MessageRole, messages} from '../domain/KnowledgeBase';
import ChatMessageResponse from '../dtos/classes/ChatMessageResponse';
import {IOpenAPIResponse} from '../dtos/interfaces/IOpenAPIResponse';
import {IHttpClient} from './http/IHttpClient';

class LocalLlmClient implements IAgentClient {
    public endpointURL = `${process.env.SELF_DEPLOYED_LLM_HOST}/dev/chat/completions`;
    private readonly httpClient: IHttpClient;

    constructor(private client: IHttpClient) {
        this.httpClient = client;
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
                },
            };
            const body = {
                model: 'FastLlama',
                messages: [...messages, { role: MessageRole.USER, content: message }],
                temperature: 0.7,
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

export default LocalLlmClient
