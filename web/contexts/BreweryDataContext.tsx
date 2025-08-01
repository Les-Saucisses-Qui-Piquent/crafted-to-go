import React, { createContext, useContext, useEffect, useState } from "react";
import { useApiClient } from "@/utils/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { BeerCardProps } from "@/components/beerCard/BeerCard";
import { OrderCardProps } from "@/components/beerCard/OrderCard";

// --- Interfaces
export interface Brewery {
  id: string;
  name: string;
  image: string | null;
  logo: string | null;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  brewery_id: string;
}

interface BreweryDataContextType {
  brewery: Brewery | null;
  beers: BeerCardProps[];
  orders: OrderCardProps[];
  loading: boolean;
}

// --- Contexte
const BreweryDataContext = createContext<BreweryDataContextType>({
  brewery: null,
  beers: [],
  orders: [],
  loading: true,
});

export const useBreweryData = () => useContext(BreweryDataContext);

// --- Provider
export const BreweryDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { apiClient } = useApiClient();
  const { user } = useAuth();

  const [brewery, setBrewery] = useState<Brewery | null>(null);
  const [beers, setBeers] = useState<BeerCardProps[]>([]);
  const [orders, setOrders] = useState<OrderCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreweryData = async () => {
      if (!user || user.role !== "brewer") {
        console.warn("Utilisateur non autorisé ou non connecté.");
        setLoading(false);
        return;
      }

      try {
        const breweries = await apiClient(`/breweries?owner_id=${user.id}`, { method: "GET" });

        if (!breweries.length) {
          console.warn("Aucune brasserie trouvée.");
          return;
        }

        const userBrewery = breweries[0];

        const [detailsData, ordersData, beersData] = await Promise.all([
          apiClient("/brewery-details", { method: "GET" }),
          apiClient(`/orders?brewery_id=${userBrewery.id}`, { method: "GET" }),
          apiClient(`/beers?brewery_id=${userBrewery.id}`, { method: "GET" }),
        ]);

        const detail = detailsData.find((d: Brewery) => d.brewery_id === userBrewery.id);

        setBrewery({
          ...userBrewery,
          image: detail?.image || null,
          logo: detail?.logo || null,
          description: detail?.description || "",
        });

        setOrders(ordersData);
        setBeers(beersData);
      } catch (error) {
        console.error("Erreur de chargement des données de brasserie :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreweryData();
  }, []);

  return (
    <BreweryDataContext.Provider value={{ brewery, beers, orders, loading }}>
      {children}
    </BreweryDataContext.Provider>
  );
};
