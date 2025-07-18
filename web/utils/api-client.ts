export const useApiClient = () => {
  const apiClient = async (endpoint: string, options: RequestInit) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    });

    return response;
  };

  return { apiClient };
};
