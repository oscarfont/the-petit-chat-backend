export const generate = async () => {
  return {
    body: JSON.stringify({ data: "success" }),
    statusCode: 200,
  };
};
