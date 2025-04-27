import { Ollama } from 'ollama'
import { IAgentClient } from '../domain/IAgentClient';
import ChatMessageResponse from '../dtos/classes/ChatMessageResponse';

class OllamaClient implements IAgentClient {
    private ollama = new Ollama({ host: 'http://127.0.0.1:11435' })
    public async generate(message: string): Promise<ChatMessageResponse> {
        const response = await this.ollama.chat({
            model: 'deepseek-r1:8b',
            messages: [{ role: 'user', content: 'Why is the sky blue?' }],
        })
        return new ChatMessageResponse({
            id: '',
            model: 'deep-seek-r1',
            message: response.message.content,
            contentLength: response.message.content.length,
        });
    }
}

export default OllamaClient
