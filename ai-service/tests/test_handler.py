import unittest
from app import handler
import json
from pydantic import ValidationError


class TestHandlerIntegration(unittest.TestCase):

    def test_successful_chat_completion_integration(self):
        mock_event = {
            'body': json.dumps({
                "model": "FastLlama",
                "messages": [
                    {"role": "system", "content": "Eres un asistente útil."},
                    {"role": "user", "content": "Cuéntame algo interesante."}
                ],
                "temperature": 0.7
            })
        }
        mock_context = {}

        response = handler.chat_completions(mock_event, mock_context)

        self.assertEqual(response['statusCode'], 200)
        body = json.loads(response['body'])
        self.assertIn('choices', body)
        self.assertIsInstance(body['choices'], list)
        self.assertTrue(len(body['choices']) > 0)
        self.assertIn('text', body['choices'][0])

    def test_invalid_chat_completion_request_integration(self):
        mock_event = {'body': json.dumps({"model": "FastLlama"})}
        mock_context = {}

        with self.assertRaises(ValidationError):
            handler.chat_completions(mock_event, mock_context)


if __name__ == '__main__':
    unittest.main()
