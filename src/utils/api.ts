const getApiUrl = (endpoint: string): string => {
  const isProduction = import.meta.env.PROD;
  const baseUrl = isProduction ? '/pricing_tool' : '';
  return `${baseUrl}/api${endpoint}`;
};

export const fetchApi = async (endpoint: string, options?: RequestInit) => {
  const url = getApiUrl(endpoint);
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};
