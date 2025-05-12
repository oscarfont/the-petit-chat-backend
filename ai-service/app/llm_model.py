from llama_cpp import (Llama, ChatCompletionRequestSystemMessage, ChatCompletionRequestUserMessage,
                       ChatCompletionRequestAssistantMessage)
from enum import Enum
from typing import Literal, List
from app.chat_completions_request import ChatCompletionMessage


class ModelName(Enum):
    FAST_LLAMA = 1

    @staticmethod
    def from_request(name: Literal['FastLlama']):
        if name == 'FastLlama':
            return ModelName.FAST_LLAMA
        else:
            return None


class MessageRole(Enum):
    SYSTEM = 1
    USER = 2
    ASSISTANT = 3


class LlmModel:
    name: ModelName
    messages: List[ChatCompletionRequestSystemMessage |
                   ChatCompletionRequestUserMessage |
                   ChatCompletionRequestAssistantMessage]
    temperature: float
    llm: Llama

    llama_prompt_system_header = "<|begin_of_text|><|start_header_id|>system<|end_header_id|>"
    llama_prompt_user_header = "<|eot_id|><|start_header_id|>user<|end_header_id|>"
    llama_prompt_assistant_header = "<|eot_id|><|start_header_id|>assistant<|end_header_id|>"

    def __init__(self, name: ModelName, messages: List[ChatCompletionMessage], ctx_length: int, temperature: float):
        self.name = name
        self.messages = self.convert_to_llama_messages(messages)
        self.temperature = temperature
        self.llm = Llama.from_pretrained(
            repo_id="bartowski/FastLlama-3.2-1B-Instruct-GGUF",
            filename="FastLlama-3.2-1B-Instruct-Q4_0.gguf",
            verbose=False
        )

    def llama_messages_to_prompt(self, prompt: str, context: str, user_query: str) -> str:
        return f"""
            {self.llama_prompt_system_header}
            {prompt}
            <context>
            {context if context else "No hay información disponible."}
            </context>
            {self.llama_prompt_user_header}
            {user_query}
            {self.llama_prompt_assistant_header}
        """

    def convert_to_llama_messages(self, messages: List[ChatCompletionMessage]):
        converted_messages = []
        for message in messages:
            if message.role == 'assistant':
                converted = ChatCompletionRequestAssistantMessage(
                    role='assistant',
                    content=message.content
                )
            elif message.role == 'user':
                converted = ChatCompletionRequestUserMessage(
                    role='user',
                    content=message.content
                )
            else:
                converted = ChatCompletionRequestSystemMessage(
                    role='system',
                    content=message.content
                )
            converted_messages.append(converted)
        return converted_messages

    def create_chat_completions(self):
        return self.llm(
            prompt=self.llama_messages_to_prompt(
                self.messages[0]['content'],
                "",
                self.messages[1]['content']
            ),
            max_tokens=512,
            stop=["<|eot_id|>"]
        )
