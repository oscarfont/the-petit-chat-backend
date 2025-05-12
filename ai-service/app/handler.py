from app.chat_completions_request import ChatCompletionsRequest
from app.llm_model import LlmModel, ModelName
import json


def chat_completions(event, context):
    request = ChatCompletionsRequest(**json.loads(event['body']))

    llm = LlmModel(
        name=ModelName.from_request(name=request.model),
        messages=request.messages,
        ctx_length=1024,
        temperature=0.7
    )

    response = llm.create_chat_completions()

    return {
        "statusCode": 200,
        "body": json.dumps(response)
    }
