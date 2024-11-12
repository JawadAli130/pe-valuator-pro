const getApiUrl = (endpoint: string): string => {
  const isProduction = import.meta.env.PROD;
  const baseUrl = isProduction ? '/pricing_tool' : '';
  return `${baseUrl}/api${endpoint}`;
};

export const fetchApi = async (endpoint: string, options?: RequestInit) => {
  const url = getApiUrl(endpoint);
  const response = await fetch(url, options);

  if (!response.ok) {
    // Attempt to parse error message from response body if available
    let errorMessage = `API call failed: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        errorMessage += ` - ${errorData.error}`;
      }
    } catch (e) {
      // Ignore parsing error
    }
    throw new Error(errorMessage);
  }

  // Check if the response has content
  const contentType = response.headers.get('Content-Type');
  const contentLength = response.headers.get('Content-Length');

  if (response.status === 204 || !contentType || contentLength === '0') {
    // No content to parse
    return null;
  }

  // Parse the response as JSON
  return response.json();
};
