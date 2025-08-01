import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { BeerCardProps } from "./BeerCard";
const isTabletDevice = () => {
  const { width } = Dimensions.get("window");
  return width >= 600;
};

interface BeerCardLargeProps {
  beer: BeerCardProps;
  isTablet?: boolean;
}

export default function BeerCardLarge({ beer, isTablet = isTabletDevice() }: BeerCardLargeProps) {
  const styles = isTablet ? tabletStyles : mobileStyles;

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: beer.image }} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{beer.name}</Text>
        <View style={styles.bottomInfo}>
          <View style={styles.abvStyleRow}>
            {beer.beer_style && <Text style={styles.beerStyle}>{beer.beer_style.label}</Text>}
            <Text style={styles.abv}>{beer.abv_rate}%</Text>
          </View>
          <Text style={styles.stock}>En stock : {beer.quantity}</Text>
          <Text style={styles.price}>Prix : {beer.price}€</Text>
          {beer.brewery && <Text style={styles.brewery}>En vente chez {beer.brewery.name}</Text>}
        </View>
      </View>
    </View>
  );
}

const mobileStyles = StyleSheet.create({
  container: {
    width: 300,
    height: 450,
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
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    textTransform: "capitalize",
  },
  bottomInfo: {
    gap: 2,
    marginTop: 8,
  },
  abvStyleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  beerStyle: {
    fontSize: 16,
    color: "#000",
    marginRight: 8,
    textTransform: "capitalize",
  },
  abv: {
    fontSize: 16,
    color: "#000",
  },
  stock: {
    fontSize: 14,
    color: "#888",
    fontWeight: "300",
  },
  price: {
    fontSize: 14,
    fontWeight: "300",
    color: "#888",
  },
  brewery: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});

// Tablet styles
const tabletStyles = StyleSheet.create({
  container: {
    width: 350,
    height: 550,
    backgroundColor: "#fff",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 350,
  },
  infoContainer: {
    padding: 15,
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    textTransform: "capitalize",
  },
  bottomInfo: {
    gap: 2,
    marginTop: 10,
  },
  abvStyleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  beerStyle: {
    fontSize: 18,
    color: "#000",
    marginRight: 10,
    textTransform: "capitalize",
  },
  abv: {
    fontSize: 18,
    color: "#000",
  },
  stock: {
    fontSize: 16,
    color: "#888",
    fontWeight: "300",
  },
  price: {
    fontSize: 16,
    fontWeight: "300",
    color: "#888",
  },
  brewery: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});
