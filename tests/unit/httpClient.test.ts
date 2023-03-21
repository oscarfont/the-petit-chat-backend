import { AxiosInstance, AxiosRequestConfig } from "axios";
import HttpClient from "../../src/adapters/http/HttpClient";

describe("HttpClient adapter class", () => {
  let axiosInstance: AxiosInstance;
  let httpClient: HttpClient;

  beforeEach(() => {
    axiosInstance = {
      post: jest.fn(),
    } as unknown as AxiosInstance;

    httpClient = new HttpClient(axiosInstance);
  });

  test("should create axios adapter correctly without passing an axiosInstance", async () => {
    const httpClient2 = new HttpClient();
    expect(httpClient2).toBeTruthy();
  });

  describe("post requests tests", () => {
    test("should call axiosInstance.post with the provided URL, data, and config", async () => {
      const url = "https://example.com";
      const data = { foo: "bar" };
      const config: AxiosRequestConfig = {
        headers: { "Content-Type": "application/json" },
      };
      (
        axiosInstance.post as jest.MockedFunction<typeof axiosInstance.post>
      ).mockResolvedValueOnce({ data: {} });

      await httpClient.post(url, data, config);

      expect(axiosInstance.post).toHaveBeenCalledWith(url, data, config);
    });

    test("should return the response data", async () => {
      const responseData = { message: "Hello, world!" };
      const url = "https://example.com";
      const data = { foo: "bar" };
      (
        axiosInstance.post as jest.MockedFunction<typeof axiosInstance.post>
      ).mockResolvedValueOnce({ data: responseData });

      const result = await httpClient.post(url, data);

      expect(result).toEqual(responseData);
    });
  });
});
