import { useAuth } from "@/contexts/AuthContext";

export const useApiClient = () => {
  const { token } = useAuth();

  const apiClient = async (endpoint: string, options: RequestInit) => {
    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      credentials: "include",
    });

    return response;
  };

  return { apiClient };
};
