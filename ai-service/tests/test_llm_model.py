import unittest
from unittest.mock import MagicMock, patch
from parameterized import parameterized
from app.chat_completions_request import ChatCompletionMessage
from app.llm_model import ModelName, LlmModel


class TestLlmModel(unittest.TestCase):

    @patch('app.llm_model.Llama.from_pretrained')
    def setUp(self, mock_llama_from_pretrained):
        self.mocked_llama_instance = MagicMock()
        mock_llama_from_pretrained.return_value = self.mocked_llama_instance
        self.mock_llama_from_pretrained = mock_llama_from_pretrained  # Keep a reference

    def tearDown(self):
        pass  # No need to clean up the mock as patch handles it

    def assert_message(self, message, expected_role, expected_content):
        self.assertIn('role', message)
        self.assertEqual(message['role'], expected_role)
        self.assertIn('content', message)
        self.assertEqual(message['content'], expected_content)

    @parameterized.expand([
        ("valid", "FastLlama", ModelName.FAST_LLAMA),
        ("invalid", "Qwen", None)
    ])
    def test_model_names(self, name, model_name, expected_result):
        self.assertEqual(ModelName.from_request(model_name), expected_result)

    def test_initialization(self):
        with patch('app.llm_model.Llama.from_pretrained', self.mock_llama_from_pretrained):
            name = ModelName.FAST_LLAMA
            messages = [
                ChatCompletionMessage(role='system', content='You are helpful.'),
                ChatCompletionMessage(role='user', content='Hello?')
            ]
            temperature = 0.7
            model = LlmModel(name=name, messages=messages, ctx_length=2048, temperature=temperature)
            self.assertEqual(model.name, name)
            self.assertEqual(model.temperature, temperature)
            self.assertEqual(len(model.messages), 2)
            self.assert_message(model.messages[0], 'system', 'You are helpful.')
            self.assert_message(model.messages[1], 'user', 'Hello?')
            self.mock_llama_from_pretrained.assert_called_once_with(
                repo_id="bartowski/FastLlama-3.2-1B-Instruct-GGUF",
                filename="FastLlama-3.2-1B-Instruct-Q4_0.gguf",
                verbose=False
            )

    def test_convert_to_llama_messages(self):
        messages = [
            ChatCompletionMessage(role='system', content='System prompt'),
            ChatCompletionMessage(role='user', content='User query'),
            ChatCompletionMessage(role='assistant', content='Assistant reply')
        ]
        with patch('app.llm_model.Llama.from_pretrained', self.mock_llama_from_pretrained):
            model = LlmModel(name=ModelName.FAST_LLAMA, messages=[], ctx_length=2048, temperature=0.8)
            llama_messages = model.convert_to_llama_messages(messages)

            self.assertEqual(len(llama_messages), 3)
            self.assert_message(llama_messages[0], 'system', 'System prompt')
            self.assert_message(llama_messages[1], 'user', 'User query')
            self.assert_message(llama_messages[2], 'assistant', 'Assistant reply')

    def test_llama_messages_to_prompt(self):
        name = ModelName.FAST_LLAMA
        messages = [
            ChatCompletionMessage(role='system', content='You are a test bot.'),
            ChatCompletionMessage(role='user', content='What is your name?')
        ]
        temperature = 0.6
        with patch('app.llm_model.Llama.from_pretrained', self.mock_llama_from_pretrained):
            model = LlmModel(name=name, messages=messages, ctx_length=2048, temperature=temperature)
            prompt = model.llama_messages_to_prompt(
                prompt=messages[0].content,
                context="Some context.",
                user_query=messages[1].content
            )
            expected_prompt = """
            <|begin_of_text|><|start_header_id|>system<|end_header_id|>
            You are a test bot.
            <context>
            Some context.
            </context>
            <|eot_id|><|start_header_id|>user<|end_header_id|>
            What is your name?
            <|eot_id|><|start_header_id|>assistant<|end_header_id|>
            """
            self.assertEqual(prompt.strip(), expected_prompt.strip())

    def test_create_chat_completions(self):
        with patch('app.llm_model.Llama.from_pretrained', self.mock_llama_from_pretrained):
            name = ModelName.FAST_LLAMA
            messages = [
                ChatCompletionMessage(role='system', content='Do as I say.'),
                ChatCompletionMessage(role='user', content='Respond with "OK".')
            ]
            temperature = 0.5
            model = LlmModel(name=name, messages=messages, ctx_length=2048, temperature=temperature)

            # Configure the mock to return a specific response when called
            mock_response = {"choices": [{"text": "OK"}]}
            self.mocked_llama_instance.return_value = mock_response

            result = model.create_chat_completions()
            self.assertEqual(result, mock_response)

            # Verify that the Llama model's __call__ method was called (via our mock)
            self.mocked_llama_instance.assert_called_once()
            _, kwargs = self.mocked_llama_instance.call_args
            expected_prompt = """
            <|begin_of_text|><|start_header_id|>system<|end_header_id|>
            Do as I say.
            <context>
            No hay información disponible.
            </context>
            <|eot_id|><|start_header_id|>user<|end_header_id|>
            Respond with "OK".
            <|eot_id|><|start_header_id|>assistant<|end_header_id|>
            """
            self.assertEqual(kwargs['prompt'].strip(), expected_prompt.strip())
            self.assertEqual(kwargs['max_tokens'], 512)
            self.assertEqual(kwargs['stop'], ["<|eot_id|>"])


if __name__ == '__main__':
    unittest.main()
