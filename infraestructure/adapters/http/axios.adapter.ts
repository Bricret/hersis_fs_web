import axios, { type AxiosInstance } from "axios";
import type { HttpAdapter } from "./http.adapter";

interface Options {
  baseUrl: string;
  getToken?: string | undefined;
}

export class axiosAdapter implements HttpAdapter {
  private axiosInstance: AxiosInstance;

  constructor(options: Options) {
    this.axiosInstance = axios.create({
      baseURL: options.baseUrl,
    });
  }

  async post<T>(
    url: string,
    body: Record<string, unknown>,
    options?: Record<string, unknown> | undefined,
    tk?: string | undefined
  ): Promise<T> {
    try {
      if (tk) {
        this.patchToken(tk);
      }

      const { data } = await this.axiosInstance.post<T>(url, body, options);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Error desconocido");
    }
  }

  async patch<T>(
    url: string,
    body: Record<string, unknown>,
    options?: Record<string, unknown> | undefined
  ): Promise<T> {
    try {
      const { data } = await this.axiosInstance.patch<T>(url, body, options);
      return data;
    } catch (error: unknown) {
      console.error("Error en axiosAdapter.patch:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error en la petición PATCH"
        );
      }
      throw new Error("Error desconocido en la petición PATCH");
    }
  }

  async delete<T>(
    url: string,
    options?: Record<string, unknown> | undefined
  ): Promise<T> {
    try {
      const { data } = await this.axiosInstance.delete<T>(url, options);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Error desconocido");
    }
  }

  async get<T>(
    url: string,
    options?: Record<string, unknown> | undefined,
    tk?: string | undefined
  ): Promise<T> {
    try {
      if (tk) this.patchToken(tk);
      const { data } = await this.axiosInstance.get<T>(url, options);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Error desconocido");
    }
  }

  async patchToken(tk: string) {
    this.axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${tk}`;
      return config;
    });
  }
}
