import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useApiClient } from "@/utils/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { COLORS } from "@/constants";
import BeerCardSmall from "@/components/beerCard/BeerCardSmall";
import BreweryCardSmall from "@/components/brewery/BreweryCardSmall";
import { BeerCardProps } from "@/components/beerCard/BeerCard";

// Typage favoris brasserie
type FavoriteBrewery = {
  id: string;
  user_id: string;
  brewery_id: string;
  liked_at: string;
  brewery: {
    id: string;
    name: string;
    logo?: string;
    image?: string;
    // autres champs si besoin
  } | null;
};

const Favorites: React.FC = () => {
  const { apiClient } = useApiClient();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [favoriteBeers, setFavoriteBeers] = useState<BeerCardProps[]>([]);
  const [favoriteBreweries, setFavoriteBreweries] = useState<FavoriteBrewery[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    (async () => {
      try {
        const beersRes = await apiClient(`/favorite-beers/${user.id}`, { method: "GET" });
        const breweriesRes = await apiClient(`/favorite-breweries/${user.id}`, { method: "GET" });
        const beersData: BeerCardProps[] = await beersRes.json();
        const breweriesData: FavoriteBrewery[] = await breweriesRes.json();
        setFavoriteBeers(beersData);
        setFavoriteBreweries(breweriesData);
      } catch (e) {
        // Gère l’erreur si besoin
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Mes bières favorites</Text>
      {favoriteBeers.length === 0 ? (
        <Text style={styles.emptyText}>Aucune bière favorite.</Text>
      ) : (
        favoriteBeers.map((fav, idx) =>
          fav ? (
            <BeerCardSmall
              key={fav.id || idx}
              title={fav.title}
              imgPath={fav.imgPath || ""}
              style={fav.style || ""}
              abv={fav.abv?.toString() || ""}
              price={fav.price?.toString() + "€" || ""}
              stock={fav.stock}
            />
          ) : null,
        )
      )}

      <Text style={styles.sectionTitle}>Mes brasseries favorites</Text>
      {favoriteBreweries.length === 0 ? (
        <Text style={styles.emptyText}>Aucune brasserie favorite.</Text>
      ) : (
        favoriteBreweries.map((fav, idx) =>
          fav.brewery ? (
            <BreweryCardSmall
              key={fav.brewery.id || idx}
              title={fav.brewery.name}
              imgPath={fav.brewery.logo || fav.brewery.image || ""}
            />
          ) : null,
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.white, flex: 1, padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginVertical: 16, color: COLORS.primary },
  emptyText: { color: COLORS.greyscale900, fontSize: 16, marginVertical: 8 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default Favorites;
