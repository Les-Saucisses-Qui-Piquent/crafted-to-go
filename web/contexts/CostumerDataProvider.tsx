import React, { createContext, useContext, useEffect, useState } from "react";
import { useApiClient } from "@/utils/api-client";
import { BeerCardProps } from "@/components/beerCard/BeerCard";
import { BreweryProps } from "@/components/brewery/BreweryCardSmall";

interface ClientDataContextProps {
  beers: BeerCardProps[];
  breweries: BreweryProps[];
  loading: boolean;
}

const ClientDataContext = createContext<ClientDataContextProps>({
  beers: [],
  breweries: [],
  loading: true,
});

export const ClientDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { apiClient } = useApiClient();
  const [beers, setBeers] = useState<BeerCardProps[]>([]);
  const [breweries, setBreweries] = useState<BreweryProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const beersRes = await apiClient("/beers", { method: "GET" });
        const beersData = await beersRes.json();

        const breweriesRes = await apiClient("/breweries", { method: "GET" });
        const breweriesData = await breweriesRes.json();

        const detailsRes = await apiClient("/brewery-details", { method: "GET" });
        const detailsData = await detailsRes.json();

        const enrichedBreweries = breweriesData.map((brewery: BreweryProps) => {
          const detail = detailsData.find((d: BreweryProps) => d.brewery_id === brewery.id);
          return {
            ...brewery,
            image: detail?.image || null,
            logo: detail?.logo || null,
            description: detail?.description || "",
          };
        });

        setBeers(beersData);
        setBreweries(enrichedBreweries);
      } catch (err) {
        console.error("Erreur chargement client :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ClientDataContext.Provider value={{ beers, breweries, loading }}>
      {children}
    </ClientDataContext.Provider>
  );
};

export const useClientData = () => useContext(ClientDataContext);
