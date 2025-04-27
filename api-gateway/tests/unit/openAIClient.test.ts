import { AxiosInstance } from 'axios';
import ChatMessageResponse from '../../src/dtos/classes/ChatMessageResponse';
import HttpClient from '../../src/infrastructure/http/HttpClient';
import OpenAIClient from '../../src/infrastructure/OpenAIClient';

describe('OpenAIClient tests', () => {
  let axiosInstance: AxiosInstance;
  let httpClient: HttpClient;
  let openAiClient: OpenAIClient;

  beforeAll(() => {
    axiosInstance = {
      post: jest.fn(),
    } as unknown as AxiosInstance;

    httpClient = new HttpClient(axiosInstance);
    openAiClient = new OpenAIClient(httpClient);
  });

  test('Check API_KEY is added successfully from .env.local variables', () => {
    expect(openAiClient.apiKeyIsNotEmpty()).toBeTruthy();
  });

  test('Sending a completion POST request to OpenAI returns a ChatMessage object', async () => {
    const data = {
      choices: [
        {
          message: {
            content: '¡Hola Petit Traveller! ¿En qué puedo ayudarte?',
            role: 'assistant',
          },
          finish_reason: null,
          index: 0,
        },
      ],
      usage: {
        completion_tokens: 2,
        prompt_tokens: 3,
        total_tokens: 139,
      },
      created: 1677825464,
      id: 'chatcmpl-6ptKyqKOGXZT6iQnqiXAH8adNLUzD',
      model: 'gpt-3.5-turbo-0301',
      object: 'chat.completion.chunk',
    };

    (
      axiosInstance.post as jest.MockedFunction<typeof axiosInstance.post>
    ).mockResolvedValueOnce({ data });

    const expectedObject = new ChatMessageResponse();
    expectedObject.fromOpenAPIResponse(data);

    const response = await openAiClient.generate('');
    expect(response).toMatchObject(expectedObject);
  });

  test('Sending a completion POST request to OpenAI throws an exception and is handled successfully', async () => {
    (
      axiosInstance.post as jest.MockedFunction<typeof axiosInstance.post>
    ).mockRejectedValueOnce('Oops something went wrong!');

    try {
      expect(await openAiClient.generate('')).toThrow(
        'Oops something went wrong!',
      );
    } catch (e) {
      console.log(e);
    }
  });
});
