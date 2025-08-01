import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { BeerCardProps } from "./BeerCard";

interface BeerCardSmallProps {
  beer: BeerCardProps;
}

export default function BeerCardSmall({ beer }: BeerCardSmallProps) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={beer.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{beer.name}</Text>
        <View style={styles.bottomInfo}>
          <View style={styles.abvStyleRow}>
            {beer.beer_style && <Text style={styles.beerStyle}>{beer.beer_style.label}</Text>}
            <Text style={styles.abv}>{beer.abv_rate}%</Text>
          </View>
          <Text style={styles.stock}>En stock : {beer.quantity}</Text>
          <Text style={styles.price}>Prix : {beer.price}€</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 220,
    backgroundColor: "#fff",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
  },
  infoContainer: {
    padding: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
    textTransform: "capitalize",
    marginBottom: 6,
  },
  bottomInfo: {
    gap: 4,
  },
  abvStyleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  beerStyle: {
    fontSize: 12,
    color: "#000",
    marginRight: 6,
    textTransform: "capitalize",
  },
  abv: {
    fontSize: 12,
    color: "#000",
  },
  stock: {
    fontSize: 10,
    color: "#888",
    fontWeight: "300",
  },
  price: {
    fontSize: 10,
    fontWeight: "300",
    color: "#888",
  },
});
