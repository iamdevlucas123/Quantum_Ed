// Shared client for authenticated requests to the API.
// The fetch-related types used here come from the browser Fetch API exposed by TypeScript's DOM lib:
// - globalThis.RequestInit
// - globalThis.Response
// - globalThis.Headers

import { env } from '../config/env';
import { useAuthStore } from '../context/auth_store';
import { useUiStore } from '../context/ui_store';

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

type FetchRequestOptions = globalThis.RequestInit;
type FetchResponse = globalThis.Response;
type FetchHeaders = globalThis.Headers;

type RequestOptions = FetchRequestOptions & {
  retryOnUnauthorized?: boolean;
};

// Try to read a JSON error payload. If the response body is empty or is not JSON,
// fall back to a generic message based on the HTTP status code.
const readErrorMessage = async (response: FetchResponse): Promise<string> => {
  let data: ApiErrorResponse = {};

  try {
    data = await response.json();
  } catch {
    // Some API responses have no JSON body, for example an empty 500 response or
    // a plain-text error. In that case we ignore the body parsing failure and
    // return a message built from response.status below.
  }

  if (data.error) {
    return data.error;
  }

  if (data.message) {
    return data.message;
  }

  return `Request failed with status ${response.status}`;
};

// Convert the Response to an expected type.
const parseResponse = async <T>(response: FetchResponse): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

const buildHeaders = (options: RequestOptions, accessToken: string | null): FetchHeaders => {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return headers;
};

const sendRequest = (path: string, options: RequestOptions, accessToken: string | null): Promise<FetchResponse> => {
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
  let shouldRetry = true;

  if (typeof options.retryOnUnauthorized === 'boolean') {
    shouldRetry = options.retryOnUnauthorized;
  }

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
