import React, { createContext, useContext, useEffect, useState } from "react";
import { BeerCardProps } from "@/components/beerCard/BeerCard";
import { BreweryProps } from "@/components/brewery/BreweryCardSmall";
import { useAuth } from "./AuthContext";
import { useApiClient } from "@/utils/api-client";

interface ClientDataContextProps {
  beers: BeerCardProps[];
  breweries: BreweryProps[];
  favoriteBeers: BeerCardProps[];
  favoriteBreweries: BreweryProps[];
  loading: boolean;
  toggleFavoriteBeer: (beerId: string) => Promise<void>;
  toggleFavoriteBrewery: (breweryId: string) => Promise<void>;
}

const ClientDataContext = createContext<ClientDataContextProps | undefined>(undefined);

export const ClientDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { apiClient } = useApiClient();

  const [beers, setBeers] = useState<BeerCardProps[]>([]);
  const [breweries, setBreweries] = useState<BreweryProps[]>([]);
  const [favoriteBeers, setFavoriteBeers] = useState<BeerCardProps[]>([]);
  const [favoriteBreweries, setFavoriteBreweries] = useState<BreweryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) {
      setBeers([]);
      setBreweries([]);
      setFavoriteBeers([]);
      setFavoriteBreweries([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const [beersData, breweriesData, favBeersData, favBreweriesData]: [
          BeerCardProps[],
          BreweryProps[],
          BeerCardProps[],
          BreweryProps[],
        ] = await Promise.all([
          apiClient("/beers", { method: "GET" }),
          apiClient("/breweries", { method: "GET" }),
          apiClient(`/favorite-beers/${user.id}`, { method: "GET" }),
          apiClient(`/favorite-breweries/${user.id}`, { method: "GET" }),
        ]);

        setBeers(beersData);
        setBreweries(breweriesData);
        setFavoriteBeers(favBeersData);
        setFavoriteBreweries(favBreweriesData);
      } catch (err) {
        console.error("Erreur chargement client :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFavoriteBeer = async (beerId: string): Promise<void> => {
    if (!user) return;

    const isFavorited = favoriteBeers.some((b) => b.id === beerId);
    try {
      if (isFavorited) {
        await apiClient(`/users/${user.id}/favorite_beers/${beerId}`, { method: "DELETE" });
        setFavoriteBeers((prev) => prev.filter((b) => b.id !== beerId));
      } else {
        const newFav: BeerCardProps = await apiClient(`/users/${user.id}/favorite_beers`, {
          method: "POST",
          body: JSON.stringify({ beer_id: beerId }),
        });
        setFavoriteBeers((prev) => [...prev, newFav]);
      }
    } catch (err) {
      console.error("Erreur toggle favorite beer :", err);
    }
  };

  const toggleFavoriteBrewery = async (breweryId: string): Promise<void> => {
    if (!user) return;

    const isFavorited = favoriteBreweries.some((b) => b.id === breweryId);
    try {
      if (isFavorited) {
        await apiClient(`/users/${user.id}/favorite_breweries/${breweryId}`, { method: "DELETE" });
        setFavoriteBreweries((prev) => prev.filter((b) => b.id !== breweryId));
      } else {
        const newFav: BreweryProps = await apiClient(`/users/${user.id}/favorite_breweries`, {
          method: "POST",
          body: JSON.stringify({ brewery_id: breweryId }),
        });
        setFavoriteBreweries((prev) => [...prev, newFav]);
      }
    } catch (err) {
      console.error("Erreur toggle favorite brewery :", err);
    }
  };

  return (
    <ClientDataContext.Provider
      value={{
        beers,
        breweries,
        favoriteBeers,
        favoriteBreweries,
        loading,
        toggleFavoriteBeer,
        toggleFavoriteBrewery,
      }}
    >
      {children}
    </ClientDataContext.Provider>
  );
};

export const useClientData = (): ClientDataContextProps => {
  const context = useContext(ClientDataContext);
  if (!context) {
    throw new Error("useClientData must be used within ClientDataProvider");
  }
  return context;
};
