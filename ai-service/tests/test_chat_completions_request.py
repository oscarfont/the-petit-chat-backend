import unittest
from parameterized import parameterized
from app.chat_completions_request import ChatCompletionsRequest, ChatCompletionMessage
from pydantic import ValidationError


class TestChatCompletionsRequest(unittest.TestCase):

    def test_valid_request(self):
        payload = {
            "model": "FastLlama",
            "messages": [
                {"role": "system", "content": "Eres un asistente útil."},
                {"role": "user", "content": "Hola"}
            ],
            "temperature": 0.8
        }
        try:
            request = ChatCompletionsRequest(**payload)
            self.assertIsNotNone(request)
            self.assertEqual(request.model, "FastLlama")
            self.assertEqual(len(request.messages), 2)
            self.assertEqual(request.messages[0].role, "system")
            self.assertEqual(request.messages[1].content, "Hola")
            self.assertEqual(request.temperature, 0.8)
        except ValidationError as e:
            self.fail(f"Valid request failed: {e}")

    def test_invalid_request_missing_messages(self):
        payload = {
            "model": "FastLlama",
            "temperature": 0.5
        }
        with self.assertRaises(ValidationError):
            ChatCompletionsRequest(**payload)

    def test_invalid_request_no_system_message(self):
        payload = {
            "model": "FastLlama",
            "messages": [
                {"role": "user", "content": "Hola"},
                {"role": "assistant", "content": "Hola, ¿en qué puedo ayudarte?"}
            ],
            "temperature": 0.7
        }
        with self.assertRaises(ValidationError) as context:
            ChatCompletionsRequest(**payload)
        self.assertIn("There must be at least one message with role system", str(context.exception))

    @parameterized.expand([
        ("greater_than_one", 1.1, "Temperature must be between 0 and 1"),
        ("negative", -0.5, "Input should be greater than 0"),
    ])
    def test_invalid_request_temperature(self, name, temperature, expected_error_message):
        payload = {
            "model": "FastLlama",
            "messages": [{"role": "system", "content": "..."}],
            "temperature": temperature
        }
        with self.assertRaises(ValidationError) as context:
            ChatCompletionsRequest(**payload)
        self.assertIn(expected_error_message, str(context.exception))

    def test_invalid_chat_completion_message_role(self):
        with self.assertRaises(ValidationError) as context:
            ChatCompletionMessage(role='unknow', content='Something')
        self.assertIn("Input should be 'system', 'user' or 'assistant'", str(context.exception))


if __name__ == '__main__':
    unittest.main()
