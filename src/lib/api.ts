export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app/api').replace(/\/$/, '');

/**
 * Build API URL
 * @param endpoint - endpoint path (e.g., 'auth/login')
 * @returns full URL
 */
export const buildApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.replace(/^\/+/, ''); // Remove leading slashes
  return `${API_URL}/${cleanEndpoint}`;
};

export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const url = buildApiUrl(endpoint);
  const response = await fetch(url, options);
  return response;
};

export const apiCallWithAuth = async (endpoint: string, token: string, options?: RequestInit) => {
  const url = buildApiUrl(endpoint);
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
