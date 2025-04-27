from pydantic import BaseModel, field_validator, PositiveFloat
from typing import Literal, List


class ChatCompletionMessage(BaseModel):
    role: Literal['system', 'user', 'assistant']
    content: str


class ChatCompletionsRequest(BaseModel):
    model: Literal['FastLlama', 'Qwen']
    messages: List[ChatCompletionMessage]
    temperature: PositiveFloat

    @field_validator('messages', mode='after')
    @classmethod
    def check_at_least_one_system_message(cls, messages: List[ChatCompletionMessage]) -> List[ChatCompletionMessage]:
        for m in messages:
            if m.role == 'system':
                return messages

        raise ValueError("There must be at least one message with role system")

    @field_validator('temperature', mode='after')
    @classmethod
    def check_is_not_greater_than_one(cls, temperature: PositiveFloat) -> PositiveFloat:
        if temperature > 1.0:
            raise ValueError("Temperature must be between 0 and 1")

        return temperature
