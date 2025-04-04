import ChatMessageResponse from '../../src/dtos/classes/ChatMessageResponse';
import { IOpenAPIResponse } from '../../src/dtos/interfaces/IOpenAPIResponse';

describe('DTOs unit tests', () => {
  let sampleOpenAIData: IOpenAPIResponse;
  beforeAll(() => {
    sampleOpenAIData = {
      choices: [
        {
          message: {
            content: '2',
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
  });

  test('should create ChatMessageResponse successfully given the openAPIResponse', () => {
    const expectedChaMessage = new ChatMessageResponse({
      id: sampleOpenAIData.id,
      model: sampleOpenAIData.model,
      message: sampleOpenAIData.choices[0].message.content,
      contentLength: sampleOpenAIData.choices[0].message.content.length,
    });

    const actualMessage = new ChatMessageResponse();
    actualMessage.fromOpenAPIResponse(sampleOpenAIData);

    expect(actualMessage).toMatchObject(expectedChaMessage);
  });
});
