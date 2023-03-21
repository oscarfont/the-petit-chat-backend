import axios from "axios";

describe("Endpoint tests to verify they are available", () => {
  test("/api/healthcheck returns a 200 status code", async () => {
    await axios
      .get(process.env.API_URL + "/api/healthcheck")
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });
  test("/api/generate returns a 200 status code", async () => {
    await axios.post(process.env.API_URL + "/api/generate").then((response) => {
      expect(response.status).toBe(200);
    });
  });
});
