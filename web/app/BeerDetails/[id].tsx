import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import BeerCardLarge from "@/components/beerCard/beerCardLarge";
import SelectInput from "@/components/form/SelectInput";
import MainButton from "@/components/Buttons/MainButton";
import { useCart } from "@/contexts/CartContext";
import { useClientData } from "@/contexts/CostumerDataProvider";
import { BeerCardProps } from "@/components/beerCard/BeerCard";

const BeerDetails = (beer: BeerCardProps) => {
  const { addItem } = useCart();
  const { favoriteBeers, toggleFavoriteBeer } = useClientData();
  const isFavorite = favoriteBeers.some((b) => b.id === beer.id);

  const [quantity, setQuantity] = useState("1");

  const quantityItems = Array.from({ length: Math.min(beer.quantity, 10) }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  }));

  const handleAddToCart = () => {
    const qty = parseInt(quantity);
    if (qty > beer.quantity) {
      return Alert.alert("Stock insuffisant", "Quantité trop importante.");
    }
    addItem(
      {
        id: beer.id,
        name: beer.name,
        price: beer.price,
        breweryId: beer.breweryId,
        breweryName: beer.breweryName,
        image: beer.image,
      },
      qty,
    );
  };

  const handleToggleFavorite = () => toggleFavoriteBeer(beer.id);

  return (
    <View style={styles.container}>
      <BeerCardLarge beer={beer} />

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
