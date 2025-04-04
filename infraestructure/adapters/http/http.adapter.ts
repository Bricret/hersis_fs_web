export abstract class HttpAdapter {
  abstract get<T>(url: string, options?: Record<string, unknown>): Promise<T>;

  abstract post<T>(
    url: string,
    body: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Promise<T>;

  abstract delete<T>(
    url: string,
    options?: Record<string, unknown>
  ): Promise<T>;

  abstract patch<T>(
    url: string,
    body: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Promise<T>;
}
