export abstract class HttpAdapter {
  abstract get<T>(
    url: string,
    options?: Record<string, unknown>,
    tk?: string
  ): Promise<T>;

  abstract post<T>(
    url: string,
    body: Record<string, unknown>,
    options?: Record<string, unknown>,
    tk?: string
  ): Promise<T>;

  abstract delete<T>(
    url: string,
    body?: Record<string, unknown>,
    options?: Record<string, unknown>,
    tk?: string
  ): Promise<T>;

  abstract patch<T>(url: string, body: Record<string, unknown>): Promise<T>;
}
