import React, { createContext, useContext, useEffect, useState } from "react";
import { useApiClient } from "@/utils/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { BeerCardProps } from "@/components/beerCard/BeerCard";
import { OrderCardProps } from "@/components/beerCard/OrderCard";

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

const BreweryDataContext = createContext<BreweryDataContextType>({
  brewery: null,
  beers: [],
  orders: [],
  loading: true,
});

export const useBreweryData = () => useContext(BreweryDataContext);

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
        return;
      }

      try {
        const breweryRes = await apiClient(`/breweries?owner_id=${user.id}`, { method: "GET" });
        const breweries = await breweryRes.json();

        if (!breweries.length) {
          console.warn("Aucune brasserie trouvée pour cet utilisateur.");
          return;
        }

        const userBrewery = breweries[0];

        const detailsRes = await apiClient("/brewery-details", { method: "GET" });
        const detailsData = await detailsRes.json();
        const detail = detailsData.find((d: Brewery) => d.brewery_id === userBrewery.id);

        const ordersRes = await apiClient(`/orders?brewery_id=${userBrewery.id}`, {
          method: "GET",
        });
        const ordersData = await ordersRes.json();
        setOrders(ordersData);

        setBrewery({
          ...userBrewery,
          image: detail?.image || null,
          logo: detail?.logo || null,
          description: detail?.description || "",
        });

        const beersRes = await apiClient(`/beers?brewery_id=${userBrewery.id}`, {
          method: "GET",
        });
        const beersData = await beersRes.json();
        setBeers(beersData);
      } catch (error) {
        console.error("Erreur lors du chargement de la brasserie :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreweryData();
  }, [user]);

  return (
    <BreweryDataContext.Provider value={{ brewery, beers, orders, loading }}>
      {children}
    </BreweryDataContext.Provider>
  );
};
