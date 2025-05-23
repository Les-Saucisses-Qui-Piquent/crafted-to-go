import { useAuth } from "@/contexts/AuthContext";

export const useApiClient = () => {
  const { token } = useAuth();

  const apiClient = async (url: string, options: RequestInit) => {
    const response = await fetch(url, {
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
