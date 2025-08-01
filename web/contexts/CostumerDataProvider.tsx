import React, { createContext, useContext, useEffect, useState } from "react";
import { BeerCardProps } from "@/components/beerCard/BeerCard";
import { BreweryProps } from "@/components/brewery/BreweryCardSmall";
import { useAuth } from "./AuthContext";

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
  const { user, token } = useAuth();

  const [beers, setBeers] = useState<BeerCardProps[]>([]);
  const [breweries, setBreweries] = useState<BreweryProps[]>([]);
  const [favoriteBeers, setFavoriteBeers] = useState<BeerCardProps[]>([]);
  const [favoriteBreweries, setFavoriteBreweries] = useState<BreweryProps[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const apiClient = async (url: string, options: RequestInit = {}) => {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not defined");
    }

    const headers = options.headers ? new Headers(options.headers) : new Headers();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");

    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

    const res = await fetch(fullUrl, { ...options, headers });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  };

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

        const beersData = await apiClient("/beers");
        const breweriesData = await apiClient("/breweries");
        const favBeersData = await apiClient(`/favorite-beers/${user.id}`);
        const favBreweriesData = await apiClient(`/favorite-breweries/${user.id}`);

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
  }, [user, token]);

  const toggleFavoriteBeer = async (beerId: string) => {
    if (!user) return;

    const isFavorited = favoriteBeers.some((b) => b.id === beerId);
    try {
      if (isFavorited) {
        await apiClient(`/users/${user.id}/favorite_beers/${beerId}`, { method: "DELETE" });
        setFavoriteBeers((prev) => prev.filter((b) => b.id !== beerId));
      } else {
        const newFav = await apiClient(`/users/${user.id}/favorite_beers`, {
          method: "POST",
          body: JSON.stringify({ beer_id: beerId }),
        });
        setFavoriteBeers((prev) => [...prev, newFav]);
      }
    } catch (err) {
      console.error("Erreur toggle favorite beer :", err);
    }
  };

  const toggleFavoriteBrewery = async (breweryId: string) => {
    if (!user) return;

    const isFavorited = favoriteBreweries.some((b) => b.id === breweryId);
    try {
      if (isFavorited) {
        await apiClient(`/users/${user.id}/favorite_breweries/${breweryId}`, { method: "DELETE" });
        setFavoriteBreweries((prev) => prev.filter((b) => b.id !== breweryId));
      } else {
        const newFav = await apiClient(`/users/${user.id}/favorite_breweries`, {
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

export const useClientData = () => {
  const context = useContext(ClientDataContext);
  if (!context) {
    throw new Error("useClientData must be used within ClientDataProvider");
  }
  return context;
};
