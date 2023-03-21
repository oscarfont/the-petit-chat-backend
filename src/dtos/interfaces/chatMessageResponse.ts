export interface chatMessageResponse {
  id: string;
  model: string;
  message: string;
  contentLength: number; // tokens count
}
