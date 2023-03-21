import { chatMessageResponse } from "../interfaces/chatMessageResponse";
import { openAIAPIResponse } from "../interfaces/openAPIResponse";

class ChatMessageResponse implements chatMessageResponse {
  id: string = "";
  model: string = "";
  message: string = "";
  contentLength: number = 0;

  constructor(data?: chatMessageResponse) {
    if (data) Object.assign(this, data);
  }

  fromOpenAPIResponse(response: openAIAPIResponse) {
    this.id = response.id;
    this.model = response.model;
    this.message = response.choices[0].message.content
      ? response.choices[0].message.content
      : "";
    this.contentLength = response.choices[0].message.content?.length
      ? response.choices[0].message.content?.length
      : 0;
  }
}

export default ChatMessageResponse;
