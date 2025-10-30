import type { ApiResponse } from '../types';

const API_BASE_URL = '/api';

class ApiClient {
  private reqSeq = 0;

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const id = ++this.reqSeq;
    const startedAt = Date.now();
    const method = (options?.method ?? 'GET').toUpperCase();
    const debug = (import.meta as any)?.env?.DEV || (typeof window !== 'undefined' && window.localStorage?.getItem('API_DEBUG') === '1');

    try {
      const mergedHeaders = {
        'Content-Type': 'application/json',
        ...options?.headers,
      } as Record<string, string>;

      const bodyPreview = typeof options?.body === 'string'
        ? (options!.body as string).slice(0, 300)
        : options?.body
          ? JSON.stringify(options.body).slice(0, 300)
          : undefined;

      if (debug) {
        console.groupCollapsed(`[api#${id}] ➡ ${method} ${url}`);
        console.log('request', { headers: mergedHeaders, bodyPreview });
        console.groupEnd?.();
      }

      const response = await fetch(url, {
        ...options,
        headers: mergedHeaders,
      });

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();

      if (debug) {
        const duration = Date.now() - startedAt;
        console.groupCollapsed(`[api#${id}] ⬅ ${method} ${url} :: ${response.status} ${response.statusText} (${duration}ms)`);
        console.log('response', {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          contentType,
          bodyPreview: text.slice(0, 400),
        });
        console.groupEnd?.();
      }

      let json: any = null;
      const canParseJson = text && contentType.includes('application/json');
      if (canParseJson) {
        try {
          json = JSON.parse(text);
        } catch (parseError) {
          console.error(`[api#${id}] JSON parse error for ${method} ${url}:`, parseError);
        }
      }

      if (!response.ok) {
        const message = json?.error || json?.message || (text ? text.slice(0, 300) : '') || `HTTP ${response.status}`;
        console.error(`[api#${id}] ${method} ${url} -> ${response.status} ${response.statusText}`, { message });
        return { success: false, error: `${response.status} ${response.statusText}: ${message}` };
      }

      // On success, prefer parsed JSON; if none, try to return raw text in a consistent envelope
      if (json) return json as ApiResponse<T>;
      if (text) return { success: true, data: (text as unknown as T) };
      return { success: true } as ApiResponse<T>;
    } catch (error) {
      const duration = Date.now() - startedAt;
      console.error(`[api#${id}] Network error after ${duration}ms:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
  
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }
  
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
  
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
  
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
  
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
