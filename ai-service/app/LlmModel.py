from llama_cpp import (Llama, ChatCompletionRequestSystemMessage, ChatCompletionRequestUserMessage,
                       ChatCompletionRequestAssistantMessage)
from enum import Enum
from typing import Literal, List
from ChatCompletionsRequest import ChatCompletionMessage


class ModelName(Enum):
    FAST_LLAMA = 1
    QWEN = 2

    @staticmethod
    def from_request(name: Literal['FastLlama', 'Qwen']):
        if name == 'FastLlama':
            return ModelName.FAST_LLAMA
        else:
            return ModelName.QWEN


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

    def resolve_path_given_model_name(self, name: ModelName) -> str:
        path = None

        if name == ModelName.FAST_LLAMA:
            path = "../model/fastllama-3.2-1b-instruct-q4-0.gguf"

        if name == ModelName.QWEN:
            path = "../model/qwen2.5-3b-instruct-q4-0.gguf"

        return path

    def __init__(self, name: ModelName, messages: List[ChatCompletionMessage], ctx_length: int, temperature: float):
        self.name = name
        self.messages = self.convert_to_llama_messages(messages)
        self.temperature = temperature
        self.llm = Llama.from_pretrained(
            repo_id="bartowski/FastLlama-3.2-1B-Instruct-GGUF",
            filename="FastLlama-3.2-1B-Instruct-Q4_0.gguf"
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
            if message.role == 'system':
                converted = ChatCompletionRequestSystemMessage(
                    role='system',
                    content=message.content
                )
            elif message.role == 'user':
                converted = ChatCompletionRequestUserMessage(
                    role='user',
                    content=message.content
                )
            elif message.role == 'assistant':
                converted = ChatCompletionRequestAssistantMessage(
                    role='assistant',
                    content=message.content
                )
            else:
                raise ValueError(f"Unknown role: {message.role}")
            converted_messages.append(converted)
        return converted_messages

    def create_chat_completions(self):
        if self.name == ModelName.FAST_LLAMA:
            return self.llm(
                prompt=self.llama_messages_to_prompt(
                    self.messages[0]['content'],
                    "",
                    self.messages[1]['content']
                ),
                max_tokens=512,
                stop=["<|eot_id|>"]
            )

        if self.name == ModelName.QWEN:
            return self.llm.create_chat_completion(
                messages=self.messages,
                max_tokens=512,
                stop=["[/INST]", "[/SYS]"]
            )

        return None
