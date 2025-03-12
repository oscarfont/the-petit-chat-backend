export interface IChatMessageResponse {
  id: string;
  model: string;
  message: string;
  contentLength: number; // tokens count
}
