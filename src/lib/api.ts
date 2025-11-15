export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_URL}/${endpoint}`;
  const response = await fetch(url, options);
  return response;
};

export const apiCallWithAuth = async (endpoint: string, token: string, options?: RequestInit) => {
  const url = `${API_URL}/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
