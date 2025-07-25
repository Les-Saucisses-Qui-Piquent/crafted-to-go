import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import BeerCardLarge from "@/components/beerCard/beerCardLarge";
import SelectInput from "@/components/form/SelectInput";
import MainButton from "@/components/Buttons/MainButton";
import { useCart } from "@/contexts/CartContext";
import { BeerCardProps } from "@/components/beerCard/BeerCard";

const BeerDetails = (beer: BeerCardProps) => {
  const { addItem, getItemQuantity } = useCart();
  const price = beer.price || 0;
  const stock = beer.stock || 0;

  const [quantity, setQuantity] = useState("1");

  const quantityItems = Array.from({ length: Math.min(stock, 10) }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }));

  const handleAddToCart = () => {
    const qty = parseInt(quantity);
    if (qty > stock) {
      Alert.alert("Stock insuffisant", "La quantité sélectionnée dépasse le stock disponible.");
      return;
    }

    addItem(
      {
        id: beer.id,
        name: beer.title,
        price: beer.price,
        breweryId: beer.breweryId,
        breweryName: beer.breweryName,
        image: beer.image,
      },
      qty,
    );

    Alert.alert("Ajouté au panier", `${beer.title} x${qty} ajouté(s) au panier.`);
  };

  return (
    <View style={styles.container}>
      <BeerCardLarge
        image={beer.image}
        name={beer.title}
        description={beer.description}
        style={beer.style}
        color={beer.color}
        abv={beer.abv}
        price={`${beer.price} €`}
        stock={beer.stock?.toString()}
      />

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
  container: {
    padding: 16,
  },
  actionContainer: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 320,
  },
});

export default BeerDetails;
