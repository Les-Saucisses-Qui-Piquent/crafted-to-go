import React, { createContext, useContext, useEffect, useState } from "react";
import { useApiClient } from "@/utils/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { BeerCardProps } from "@/components/beerCard/BeerCard";
import { OrderCardProps } from "@/components/beerCard/OrderCard";
import { OrderItem } from "@/components/modals/OrderModal";

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
  orderDetails: Record<string, OrderItem[]>;
  loading: boolean;
}

// --- Contexte
const BreweryDataContext = createContext<BreweryDataContextType>({
  brewery: null,
  beers: [],
  orders: [],
  orderDetails: {},
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
  const [orderDetails, setOrderDetails] = useState<Record<string, OrderItem[]>>({});
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
          setLoading(false);
          return;
        }

        const userBrewery = breweries[0];

        const [detailsData, ordersData, beersData] = await Promise.all([
          apiClient("/brewery-details", { method: "GET" }),
          apiClient(`/orders?brewery_id=${userBrewery.id}`, { method: "GET" }),
          apiClient(`/beers?brewery_id=${userBrewery.id}`, { method: "GET" }),
        ]);
        const orderDetailsData = await apiClient(`/order-items/${ordersData.id}`, {
          method: "GET",
        });

        const detail = detailsData.find((d: Brewery) => d.brewery_id === userBrewery.id);

        setBrewery({
          ...userBrewery,
          image: detail?.image || null,
          logo: detail?.logo || null,
          description: detail?.description || "",
        });

        setBeers(beersData);
        setOrders(ordersData);

        // Mapping des détails de commande
        const detailsMap = orderDetailsData.reduce(
          (acc: Record<string, OrderItem[]>, od: OrderItem) => {
            const beer = beersData.find((b: BeerCardProps) => b.id === od.beer_id);

            const formattedItem: OrderItem = {
              id: od.id,
              title: beer?.name || "Bière inconnue",
              quantity: od.quantity,
              total: (od.quantity * od.price).toFixed(2),
              is_ready: od.is_ready,
              beer_id: od.beer_id,
              price: od.price,
              order_id: od.order_id,
            };

            if (!acc[od.order_id]) {
              acc[od.order_id] = [];
            }

            acc[od.order_id].push(formattedItem);
            return acc;
          },
          {},
        );

        setOrderDetails(detailsMap);
      } catch (error) {
        console.error("Erreur de chargement des données de brasserie :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreweryData();
  }, []);

  return (
    <BreweryDataContext.Provider
      value={{
        brewery,
        beers,
        orders,
        orderDetails,
        loading,
      }}
    >
      {children}
    </BreweryDataContext.Provider>
  );
};
