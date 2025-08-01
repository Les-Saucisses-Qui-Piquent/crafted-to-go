import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useClientData } from "@/contexts/CostumerDataProvider"; // attention au nom !

import { COLORS } from "@/constants";
import BeerCardSmall from "@/components/beerCard/BeerCardSmall";
import BreweryCardSmall from "@/components/brewery/BreweryCardSmall";

export default function Favorites() {
  const { favoriteBeers, favoriteBreweries, loading } = useClientData();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.sectionTitle}>Mes bières favorites</Text>
      {favoriteBeers.length > 0 ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {favoriteBeers.map((b) => (
            <BeerCardSmall key={b.id} beer={b} />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>Aucune bière favorite.</Text>
      )}

      <Text style={styles.sectionTitle}>Mes brasseries favorites</Text>
      {favoriteBreweries.length > 0 ? (
        <View style={{ flexDirection: "column", gap: 10 }}>
          {favoriteBreweries.map((brewery) => (
            <BreweryCardSmall key={brewery.id} {...brewery} />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>Aucune brasserie favorite.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.white, flex: 1, padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginVertical: 16, color: COLORS.primary },
  emptyText: { color: COLORS.greyscale900, fontSize: 16, marginVertical: 8 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
