import ChatMessageResponse from "../dtos/classes/ChatMessageResponse";

export interface openAIClient {
  generate(message: string): Promise<ChatMessageResponse>;
}
