import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";
import { useClientData } from "@/contexts/CostumerDataProvider";
import BeerCaroussel from "@/components/caroussel/BeerCaroussel";
import BreweryCaroussel from "@/components/caroussel/BreweryCaroussel";
import LargeBeerCaroussel from "@/components/caroussel/LargeBeerCaroussel";
import SmallBeerCaroussel from "@/components/caroussel/SmallBeerCaroussel";

export default function HomePage() {
  const { beers, breweries, loading } = useClientData();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.banner}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" }}
          style={styles.bannerImage}
        />
        <View style={styles.bannerOverlay} />
        <Text style={styles.bannerTitle}>Bienvenue sur Crafted to Go 🍺</Text>
        <Text style={styles.bannerSubtitle}>
          Commande ta bière préférée en Click & Collect, près de chez toi !
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Découvre nos brasseries partenaires</Text>
      <BreweryCaroussel breweries={breweries} />

      <Text style={styles.sectionTitle}>Bières à la une</Text>
      <LargeBeerCaroussel beers={beers} />

      <Text style={styles.sectionTitle}>Suggestions pour toi</Text>
      <BeerCaroussel beers={beers} />

      <Text style={styles.sectionTitle}>Petits formats à emporter</Text>
      <SmallBeerCaroussel beers={beers} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  banner: {
    position: "relative",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  bannerImage: { width: "100%", height: "100%", position: "absolute", top: 0, left: 0 },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  bannerTitle: { color: "#fff", fontSize: 28, fontWeight: "bold", marginBottom: 10, zIndex: 2 },
  bannerSubtitle: { color: "#fff", fontSize: 16, zIndex: 2 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
  },
  footer: { marginTop: 30, padding: 15, backgroundColor: "#f2f2f2", alignItems: "center" },
  footerText: { color: "#888", fontSize: 14 },
});
