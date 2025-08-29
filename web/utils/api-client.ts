export const useApiClient = () => {
  const apiClient = async (endpoint: string, options: RequestInit) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API_URL is not defined");
    }

    const isFormData = options.body instanceof FormData;
    const method = options.method?.toUpperCase();

    // PATCH: Ne mets le content-type que si ce n'est pas DELETE ou GET
    let headers = options.headers || {};
    if (!isFormData && method !== "DELETE" && method !== "GET") {
      headers = {
        "Content-Type": "application/json",
        ...headers,
      };
    }

    // PATCH: Pour DELETE, retire le body
    const fetchOptions: RequestInit = {
      ...options,
      headers,
      credentials: "include",
    };
    if (method === "DELETE") {
      delete fetchOptions.body;
    }

    const response = await fetch(`${apiUrl}${endpoint}`, fetchOptions);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  };

  return { apiClient };
};
