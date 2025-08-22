import React, { createContext, useContext, useEffect, useState } from "react";
import { BeerCardProps } from "@/components/beerCard/BeerCard";
import { BreweryProps } from "@/components/brewery/BreweryCardSmall";
import { useAuth } from "./AuthContext";
import { useApiClient } from "@/utils/api-client";
import { UserFull } from "@/app/customer/(tabs)/profile";

interface ClientDataContextProps {
  beers: BeerCardProps[];
  breweries: BreweryProps[];
  favoriteBeers: BeerCardProps[];
  favoriteBreweries: BreweryProps[];
  userDetails: UserFull;
  loading: boolean;
  toggleFavoriteBeer: (beerId: string) => Promise<void>;
  toggleFavoriteBrewery: (breweryId: string) => Promise<void>;
  getBeerById: (id: string) => Promise<BeerCardProps | undefined>;
  getBreweryById: (id: string) => Promise<BreweryProps | undefined>;
}

const ClientDataContext = createContext<ClientDataContextProps | undefined>(undefined);

export const ClientDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { apiClient } = useApiClient();

  const [beers, setBeers] = useState<BeerCardProps[]>([]);
  const [breweries, setBreweries] = useState<BreweryProps[]>([]);
  const [favoriteBeers, setFavoriteBeers] = useState<BeerCardProps[]>([]);
  const [favoriteBreweries, setFavoriteBreweries] = useState<BreweryProps[]>([]);
  const [userDetails, setUserDetails] = useState<UserFull | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) {
      setBeers([]);
      setBreweries([]);
      setFavoriteBeers([]);
      setFavoriteBreweries([]);
      setUserDetails(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const [beersData, breweriesData, favBeersData, favBreweriesData, userRes, userDetailsRes] =
          await Promise.all([
            apiClient("/beers", { method: "GET" }),
            apiClient("/breweries", { method: "GET" }),
            apiClient(`/favorite-beers/${user.id}`, { method: "GET" }),
            apiClient(`/favorite-breweries/${user.id}`, { method: "GET" }),
            apiClient(`/users/${user.id}`, { method: "GET" }),
            apiClient(`/user-details/user/${user.id}`, { method: "GET" }),
          ]);

        let addressRes = null;
        if (userDetailsRes?.address_id) {
          addressRes = await apiClient(`/addresses/${userDetailsRes.address_id}`, {
            method: "GET",
          });
        }

        const fullUser: UserFull = {
          ...userRes,
          userDetails: {
            ...userDetailsRes,
            address: addressRes,
          },
        };

        setBeers(beersData);
        setBreweries(breweriesData);
        setFavoriteBeers(favBeersData);
        setFavoriteBreweries(favBreweriesData);
        setUserDetails(fullUser);
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

    const isFavorite = favoriteBeers.some((b) => b.id === beerId);
    try {
      if (isFavorite) {
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

    const isFavorite = favoriteBreweries.some((b) => b.id === breweryId);
    try {
      if (isFavorite) {
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

  if (userDetails === null) {
    return null;
  }

  const getBeerById = async (id: string): Promise<BeerCardProps | undefined> => {
    try {
      const beer = await apiClient(`/beers/${id}`, { method: "GET" });
      return beer;
    } catch (err) {
      console.error("Erreur fetch beer details :", err);
      return undefined;
    }
  };

  const getBreweryById = async (id: string): Promise<BreweryProps | undefined> => {
    try {
      const [breweryRes, detailsRes] = await Promise.all([
        apiClient(`/breweries/${id}`, { method: "GET" }),
        apiClient(`/brewery-details?brewery_id=${id}`, { method: "GET" }),
      ]);

      const details = Array.isArray(detailsRes) ? (detailsRes[0] ?? null) : (detailsRes ?? null);

      const merged: BreweryProps = {
        ...breweryRes,
        ...(details || {}),
        opening_hours: details?.opening_hours ?? breweryRes.opening_hours,
        taproom_hours: details?.taproom_hours ?? breweryRes.taproom_hours,
        social_links: details?.social_links ?? breweryRes.social_links,
      } as BreweryProps;

      return merged;
    } catch (err) {
      console.error("Erreur fetch brewery details :", err);
      return undefined;
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
        userDetails,
        getBeerById,
        getBreweryById,
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
