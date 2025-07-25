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
        <View style={styles.bottomInfo}>
          <View style={styles.abvStyleRow}>
            {beer_style && <Text style={styles.beerStyle}>{beer_style}</Text>}
            <Text style={styles.abv}>{abv_rate}%</Text>
          </View>
          <Text style={styles.stock}>En stock : {quantity}</Text>
          <Text style={styles.price}>Prix : {price}€</Text>
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
    //borderWidth: 1,
    //borderRadius: 8,
    //shadowColor: "#000",
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.1,
    //shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    //borderTopLeftRadius: 8,
    //borderTopRightRadius: 8,
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
    textTransform: "capitalize"
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
