import ChatMessageResponse from '../dtos/classes/ChatMessageResponse';

export interface IAgentClient {
  generate(message: string): Promise<ChatMessageResponse>;
}
