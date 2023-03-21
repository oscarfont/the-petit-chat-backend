import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { httpClient } from "./httpClientInterface";

class HttpClient implements httpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(instance?: AxiosInstance) {
    this.axiosInstance = instance ? instance : axios.create();
  }

  /*public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.request<T>(config);
    return response.data;
  }*/

  /* public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }*/

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  /*public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }*/
}

export default HttpClient;
