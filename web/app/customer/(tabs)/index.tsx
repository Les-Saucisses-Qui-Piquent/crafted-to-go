import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";
import BeerCaroussel from "@/components/caroussel/BeerCaroussel";
import BreweryCaroussel from "@/components/caroussel/BreweryCaroussel";
import LargeBeerCaroussel from "@/components/caroussel/LargeBeerCaroussel";
import SmallBeerCaroussel from "@/components/caroussel/SmallBeerCaroussel";
import { useApiClient } from "@/utils/api-client";

export default function HomePage() {
  const { apiClient } = useApiClient();

  const [beers, setBeers] = useState([]);
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const beersRes = await apiClient("/beers", { method: "GET" });
        const beersData = await beersRes.json();

        const breweriesRes = await apiClient("/breweries", { method: "GET" });
        const breweriesData = await breweriesRes.json();

        setBeers(beersData);
        setBreweries(breweriesData);
      } catch (error) {
        console.error("Erreur API :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Bannière d’accueil */}
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

      {/* Carrousel Brasseries */}
      <Text style={styles.sectionTitle}>Découvre nos brasseries partenaires</Text>
      <BreweryCaroussel breweries={breweries} />

      {/* Carrousel Bières à la une */}
      <Text style={styles.sectionTitle}>Bières à la une</Text>
      <LargeBeerCaroussel beers={beers} />

      {/* Suggestions */}
      <Text style={styles.sectionTitle}>Suggestions pour toi</Text>
      <BeerCaroussel beers={beers} />

      {/* Petits formats */}
      <Text style={styles.sectionTitle}>Petits formats à emporter</Text>
      <SmallBeerCaroussel beers={beers} />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🍻 Crafted to Go - Le Click & Collect de la bière artisanale
        </Text>
      </View>
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
  sectionTitle: { fontSize: 22, fontWeight: "600", marginVertical: 15, marginLeft: 10 },
  footer: { marginTop: 30, padding: 15, backgroundColor: "#f2f2f2", alignItems: "center" },
  footerText: { color: "#888", fontSize: 14 },
});
