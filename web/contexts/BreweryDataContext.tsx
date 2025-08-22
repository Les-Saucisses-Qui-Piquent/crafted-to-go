import React, { createContext, useContext, useEffect, useState } from "react";
import { useApiClient } from "@/utils/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { BeerCardProps } from "@/components/beerCard/BeerCard";
import { OrderCardProps } from "@/components/beerCard/OrderCard";
import { OrderItem } from "@/components/modals/OrderModal";
import { OpeningHours } from "@/app/registerBrewery";

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

  phone_number?: string;
  email?: string;
  has_taproom?: boolean;
  taproom_hours: OpeningHours;
  opening_hours?: OpeningHours;
  social_links?: string[];
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
        // Récupérer la brasserie liée à l'utilisateur
        const breweries = await apiClient(`/breweries?owner_id=${user.id}`, { method: "GET" });

        if (!breweries.length) {
          console.warn("Aucune brasserie trouvée.");
          setLoading(false);
          return;
        }

        const userBrewery = breweries[0];

        // Récupérer les détails, commandes et bières en parallèle
        const [detailsData, ordersData, beersData] = await Promise.all([
          apiClient(`/brewery-details?brewery_id=${userBrewery.id}`, { method: "GET" }),
          apiClient(`/orders?brewery_id=${userBrewery.id}`, { method: "GET" }),
          apiClient(`/beers?brewery_id=${userBrewery.id}`, { method: "GET" }),
        ]);

        const breweryDetails = detailsData[0] || null;

        // Récupérer les détails des commandes pour chaque commande
        const orderIds = ordersData.map((order: OrderCardProps) => order.id);
        const orderDetailsRequests = orderIds.map((orderId: string) =>
          apiClient(`/order-items/${orderId}`, { method: "GET" }),
        );
        const orderDetailsArrays = await Promise.all(orderDetailsRequests);
        const orderDetailsData = orderDetailsArrays.flat();

        // Mapper les détails des commandes
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

        setBrewery({
          ...userBrewery,
          image: breweryDetails?.image || null,
          logo: breweryDetails?.logo || null,
          description: breweryDetails?.description || "",
          phone_number: breweryDetails?.phone_number || "",
          email: breweryDetails?.email || "",
          has_taproom: breweryDetails?.has_taproom || false,
          taproom_hours: breweryDetails?.taproom_hours || null,
          opening_hours: breweryDetails?.opening_hours || null,
          social_links: breweryDetails?.social_links || [],
        });

        setBeers(beersData);
        setOrders(ordersData);
        setOrderDetails(detailsMap);
      } catch (error) {
        console.error("Erreur de chargement des données de brasserie :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreweryData();
  }, [user, apiClient]);

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
