import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { generateCompletions } from "../usecases";

export const generate = middy(async (event: any, context: any) => {
  const response = {
    body: {},
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
  };
  try {
    const { message } = event?.body;
    if (!message || !(message?.length > 0))
      throw new Error("Missing parameters in the request body");
    const comlpetion = await generateCompletions(message);
    response.body = JSON.stringify(comlpetion);
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      error: `Oops something went wrong ${e?.message}`,
    });
  }
  return response;
});

generate.use(httpJsonBodyParser());
generate.use(httpErrorHandler());
