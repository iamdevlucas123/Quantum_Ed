import { env } from '../config/env';
import { useAuthStore } from '../context/auth_store';
import { useUiStore } from '../context/ui_store';

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

type RequestOptions = RequestInit & {
  retryOnUnauthorized?: boolean;
};

const readErrorMessage = async (response: Response): Promise<string> => {
  let data: ApiErrorResponse = {};

  try {
    data = await response.json();
  } catch {
    // Response body is not valid JSON; use the status fallback.
  }

  return data.error ?? data.message ?? `Request failed with status ${response.status}`;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

const buildHeaders = (options: RequestOptions, accessToken: string | null): Headers => {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return headers;
};

const sendRequest = (path: string, options: RequestOptions, accessToken: string | null): Promise<Response> => {
  const { retryOnUnauthorized: _retryOnUnauthorized, ...fetchOptions } = options;

  return fetch(`${env.API_URL}${path}`, {
    ...fetchOptions,
    credentials: 'include',
    headers: buildHeaders(options, accessToken),
  });
};

const requestLogin = (): void => {
  useUiStore.getState().openLoginModal();
};

const refreshAccessToken = async (): Promise<string | null> => {
  await useAuthStore.getState().refreshSession();
  return useAuthStore.getState().accessToken;
};

export async function protectedRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const shouldRetry = options.retryOnUnauthorized ?? true;
  const accessToken = useAuthStore.getState().accessToken;
  const response = await sendRequest(path, options, accessToken);

  if (response.status !== 401 || !shouldRetry) {
    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    return parseResponse<T>(response);
  }

  const refreshedAccessToken = await refreshAccessToken();

  if (!refreshedAccessToken) {
    useAuthStore.getState().clearSession();
    requestLogin();
    throw new Error('Authentication required');
  }

  const retryResponse = await sendRequest(path, options, refreshedAccessToken);

  if (!retryResponse.ok) {
    if (retryResponse.status === 401) {
      requestLogin();
    }

    throw new Error(await readErrorMessage(retryResponse));
  }

  return parseResponse<T>(retryResponse);
}
