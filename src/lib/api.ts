export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://elit-arte-back.vercel.app').replace(/\/$/, '');

/**
 * Build API URL with /api prefix
 * @param endpoint - endpoint path (e.g., 'press/releases')
 * @returns full URL with /api prefix
 */
export const buildApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.replace(/^\/+/, ''); // Remove leading slashes
  return `${API_URL}/api/${cleanEndpoint}`;
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
