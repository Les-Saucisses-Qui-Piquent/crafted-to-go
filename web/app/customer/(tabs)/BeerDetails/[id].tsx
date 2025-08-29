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
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
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
                      label=""
          items={quantityItems}
          selectedValue={quantity}
          onValueChange={setQuantity}
          small
          width={100}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <View style={styles.addButtonBackground} />
          <Text style={styles.addButtonText}>AJOUTER AU PANIER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
    flex: 1,
  },
  beerCard: {
    width: 300,
    height: 470,
    backgroundColor: "#fff",
    elevation: 3,
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: 300,
  },
  infoContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    textTransform: "capitalize",
  },
  tableContainer: {
    marginTop: 5,
    width: "100%",
    //borderWidth: 1,
  },
      tableRow: {
      flexDirection: "row",
      width: "100%",
      marginBottom: 4,
      justifyContent: "space-between",
    },
    tableHeader: {
      width: "18%",
      fontSize: 12,
      color: "#666",
      textAlign: "left",
      fontWeight: "200",
    },
    tableValue: {
      width: "18%",
      fontSize: 12,
      fontWeight: "bold",
      color: "#000",
      textAlign: "left",

  },
  brewery: {
    fontSize: 12,
    color: "#000",
    marginTop: 2,
    marginBottom: 8,
    fontWeight: "600",
  },
  description: {
    fontSize: 10,
    color: "#666",
    marginBottom: 10,
    lineHeight: 12,
    textAlign: "justify",
    fontWeight: "200",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 300,
  },
  addButton: {
    position: "relative",
    height: 36,
    width: 180,
  },
  addButtonBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
  },
  addButtonText: {
    position: "absolute",
    width: "100%",
    height: "100%",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "HankenGrotesk",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 36,
  },
});

export default BeerDetails;
