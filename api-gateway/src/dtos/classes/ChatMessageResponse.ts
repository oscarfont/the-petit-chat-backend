import { IChatMessageResponse } from '../interfaces/IChatMessageResponse';
import { IOpenAPIResponse } from '../interfaces/IOpenAPIResponse';

class ChatMessageResponse implements IChatMessageResponse {
  public id: string = '';
  public model: string = '';
  public message: string = '';
  public contentLength: number = 0;

  constructor(data?: IChatMessageResponse) {
    if (data) { Object.assign(this, data); }
  }

  public fromOpenAPIResponse(response: IOpenAPIResponse) {
    this.id = response.id;
    this.model = response.model;
    this.message = response.choices[0].text
      ? response.choices[0].text
      : '';
    this.contentLength = response.usage.total_tokens
  }
}

export default ChatMessageResponse;
