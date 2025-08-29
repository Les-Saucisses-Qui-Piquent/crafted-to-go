import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";
import TextCTA from "@/components/Buttons/TextCTA";
import { COLORS } from "@/constants";
import { useBreweryData } from "@/contexts/BreweryDataContext";
import { BeerCardProps } from "@/components/beerCard/BeerCard";
import CommandCard, { OrderCardProps } from "@/components/OrderCard";

export default function Dashboard() {
  const { brewery, beers, loading, orders } = useBreweryData();

  const activeOrders =
    orders?.filter((order: OrderCardProps) =>
      ["new", "in_progress", "ready"].includes(order.status),
    ) || [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!brewery) {
    return (
      <View style={styles.center}>
        <Text>Aucune brasserie associée à ce compte.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bannerTitle}>{brewery.name}</Text>
        <TextCTA title={"ma page profil"} onPress={() => {}} width={200} />
      </View>
      <View style={styles.banner}>
        <Image
          source={{
            uri: brewery.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
          }}
          style={styles.bannerImage}
        />
      </View>
      <Text style={styles.bannerSubtitle}>DASHBOARD</Text>

      {/* SECTION COMMANDES EN COURS - À faire plus tard si tu veux */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Commandes en cours</Text>
        {activeOrders.length > 0 ? (
          activeOrders.map((order) => <CommandCard key={order.id} {...order} />)
        ) : (
          <Text>Aucune commande en cours.</Text>
        )}
      </View>

      {/* SECTION BIÈRES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🍺 Bières de la brasserie</Text>
        {beers.map((beer: BeerCardProps) => (
          <View key={beer.id} style={styles.beerCard}>
            <Image source={{ uri: beer.image }} style={styles.beerImage} />
            <View style={styles.beerInfo}>
              <Text style={styles.beerName}>{beer.name}</Text>
              <Text style={styles.beerType}>{beer.beer_style.label}</Text>
              <Text style={styles.beerType}>{beer.color}</Text>
              <Text style={styles.beerDescription}>{beer.description}</Text>
              <Text style={styles.beerDescription}>Prix: {beer.price} €</Text>
              <Text style={styles.beerDescription}>Quantité: {beer.quantity}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1 },
  header: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    flex: 1,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  banner: {
    position: "relative",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  bannerImage: { width: "100%", height: "100%", position: "absolute", top: 0, left: 0 },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  bannerTitle: { color: COLORS.black, fontSize: 26, fontWeight: "bold", zIndex: 2 },
  bannerSubtitle: {
    color: COLORS.black,
    fontSize: 32,
    fontWeight: "bold",
    paddingHorizontal: 20,
    textAlign: "center",
    zIndex: 2,
  },
  section: { paddingHorizontal: 10, marginTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  beerCard: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
  },
  beerImage: { width: 100, height: 100 },
  beerInfo: { flex: 1, padding: 10 },
  beerName: { fontSize: 16, fontWeight: "bold" },
  beerType: { fontSize: 14, color: "#555" },
  beerDescription: { fontSize: 12, color: "#777", marginTop: 4 },
  footer: { marginTop: 30, padding: 15, backgroundColor: "#f2f2f2", alignItems: "center" },
  footerText: { color: "#888", fontSize: 14 },
  orderCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
});
