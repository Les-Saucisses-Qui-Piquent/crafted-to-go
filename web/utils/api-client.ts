export const useApiClient = () => {
  const apiClient = async (endpoint: string, options: RequestInit) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API_URL is not defined");
    }

    const isFormData = options.body instanceof FormData;

    const headers = isFormData
      ? options.headers
      : {
          "Content-Type": "application/json",
          ...options.headers,
        };

    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  };

  return { apiClient };
};
