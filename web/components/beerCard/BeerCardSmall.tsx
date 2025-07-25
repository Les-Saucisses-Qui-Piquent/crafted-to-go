import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface BeerCardSmallProps {
  name?: string;
  image?: string;
  beer_style?: string;
  abv_rate?: number;
  price?: number;
  quantity?: number;
}

export default function BeerCardSmall({
  name,
  image,
  beer_style,
  price,
  quantity,
  abv_rate,
}: BeerCardSmallProps) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.abv}>{abv_rate}%</Text>
        <Text style={styles.stock}>En stock : {quantity}</Text>
        <Text style={styles.price}> Prix : {price}€</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  beerStyle: {
    fontSize: 10,
    color: "#666",
    marginBottom: 4,
  },
  abv: {
    fontSize: 10,
    color: "#000",
    marginBottom: 4,
  },
  stock: {
    fontSize: 9,
    color: "#888",
    marginBottom: 4,
  },
  price: {
    fontSize: 10,
    fontWeight: "600",
    color: "#000",
  },
});
