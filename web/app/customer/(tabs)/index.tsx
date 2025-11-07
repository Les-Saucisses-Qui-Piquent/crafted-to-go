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
          source={{ uri: "https://images.unsplash.com/photo-1714668204578-797e15d56eb8?q=80&w=1154&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
          style={styles.bannerImage}
        />
      </View>
      
      <View style={styles.bannerText}>
        <Text style={styles.bannerTitle}>Bienvenue sur Crafted to Go</Text>
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
    height: 150,
    marginBottom: 10,
  },
  bannerImage: { width: "100%", height: "100%"},
  bannerText: {
    padding: 10,
    alignItems: "flex-start",
  },
  bannerTitle: { 
    fontSize: 26,
    fontWeight: "800",
    color: "black",
    fontFamily: "HankenGrotesk",
    lineHeight: 30,
    textAlign: "left",
  },
  bannerSubtitle: { 
    color: "#666", 
    fontSize: 16, 
    fontWeight: "400", 
    textAlign: "left", 
    fontFamily: "HankenGrotesk",
    marginTop: 10,
  },
  
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
