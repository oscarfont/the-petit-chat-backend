module.exports.healthcheck = async () => {
  return {
    body: JSON.stringify({ data: 'success' }),
    statusCode: 200,
  };
};
