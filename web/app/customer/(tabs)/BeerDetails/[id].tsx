import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import SelectInput from "@/components/form/SelectInput";
import MainButton from "@/components/Buttons/MainButton";
import { useCart } from "@/contexts/CartContext";
import { useClientData } from "@/contexts/CostumerDataProvider";
import { BeerCardProps } from "@/components/beerCard/BeerCard";
import { useLocalSearchParams } from "expo-router";

const BeerDetails = () => {
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;

  const { addItem } = useCart();
  const { favoriteBeers, toggleFavoriteBeer, getBeerById } = useClientData();

  const [beer, setBeer] = useState<BeerCardProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState("1");

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    getBeerById(id)
      .then((b) => {
        if (mounted) setBeer(b ?? null);
      })
      .catch((err) => console.error("Erreur fetch beer:", err))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading)
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  if (!beer)
    return (
      <View style={styles.container}>
        <Text>Données de la bière introuvables.</Text>
      </View>
    );

  const isFavorite = favoriteBeers.some((b) => b.id === beer.id);

  const quantityItems = Array.from({ length: Math.min(beer.quantity ?? 0, 10) }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  }));

  const handleAddToCart = () => {
    const qty = parseInt(quantity, 10);
    if (qty > (beer.quantity ?? 0)) {
      return Alert.alert("Stock insuffisant", "Quantité trop importante.");
    }
    addItem(
      {
        id: beer.id,
        name: beer.name,
        price: beer.price,
        breweryId: beer.breweryId,
        breweryName: beer.brewery?.name ?? "",
        image: beer.image,
      },
      qty,
    );
  };

  const handleToggleFavorite = () => toggleFavoriteBeer(beer.id);

  return (
    <View style={styles.container}>
      <View style={styles.beerCard}>
        <Image 
          style={styles.image} 
          source={{ uri: beer.image }}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{beer.name}</Text>
          {beer.brewery && <Text style={styles.brewery}>Disponible chez {beer.brewery.name}</Text>}
          <View style={styles.separator} />
          <View style={styles.tableContainer}>
            {/* Headers */}
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Style</Text>
              <Text style={styles.tableHeader}>Couleur</Text>
              <Text style={styles.tableHeader}>Taux</Text>
              <Text style={styles.tableHeader}>Prix</Text>
              <Text style={styles.tableHeader}>Stock</Text>
            </View>
            
            {/* Values */}
            <View style={styles.tableRow}>
              <Text style={styles.tableValue}>{beer.beer_style?.label}</Text>
              <Text style={styles.tableValue}>{beer.beer_color?.label}</Text>
              <Text style={styles.tableValue}>{beer.abv_rate}°</Text>
              <Text style={styles.tableValue}>{beer.price}€</Text>
              <Text style={styles.tableValue}>{beer.quantity}</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteBtn}>
        <Text style={{ fontSize: 24 }}>{isFavorite ? "❤️" : "🤍"}</Text>
      </TouchableOpacity>

      <View style={styles.actionContainer}>
        <SelectInput
          label="Quantité"
          items={quantityItems}
          selectedValue={quantity}
          onValueChange={setQuantity}
          small
          width={100}
        />
        <MainButton title="Ajouter au panier" onPress={handleAddToCart} isBlack />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  beerCard: {
    width: 300,
    height: 500,
    backgroundColor: "#fff",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 300,
  },
  infoContainer: {
    padding: 10,
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    textTransform: "capitalize",
  },
  tableContainer: {
    marginTop: 16,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tableHeader: {
    flex: 1,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  tableValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  brewery: {
    fontSize: 12,
    color: "#000",
    marginTop: 2,
    marginBottom: 8,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#D9D9D9",
    width: "100%",
    //marginVertical: 10,
  },
  favoriteBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 2,
  },
  actionContainer: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 240,
  },
});

export default BeerDetails;
