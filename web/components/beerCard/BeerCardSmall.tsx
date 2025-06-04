import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface BeerCardSmallProps {
  title?: string;
  imgPath?: string;
  style?: string;
  abv?: string;
  price?: string;
  stock?: number;
}

export default function BeerCardSmall({
  title,
  imgPath,
  style,
  price,
  stock,
  abv,
}: BeerCardSmallProps) {
  return (
    <View style={styles.beerCardSmallContainer}>
      <Image style={styles.image} source={imgPath} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.style}>{style}</Text>
      <Text style={styles.enstock}>{`En stock : \n`}</Text>
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.myVar}>{stock}</Text>
      <Text style={styles.abv}>{abv}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  beerCardSmallContainer: {
    position: "relative",
    flexShrink: 0,
    height: 197,
    width: 150,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 0,
  },
  image: {
    position: "absolute",
    flexShrink: 0,
    top: 0,
    right: 0,
    bottom: 47,
    left: 0,
  },
  title: {
    position: "absolute",
    flexShrink: 0,
    top: 152,
    right: 52,
    bottom: 31,
    left: 0,
    textAlign: "left",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Hanken Grotesk",
    fontSize: 10,
    fontWeight: 700,
  },
  style: {
    position: "absolute",
    flexShrink: 0,
    top: 162,
    right: 114,
    bottom: 18,
    left: 0,
    textAlign: "left",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Hanken Grotesk",
    fontSize: 10,
    fontWeight: 400,
  },
  enstock: {
    position: "absolute",
    flexShrink: 0,
    top: 176,
    right: 110,
    bottom: 11,
    left: 0,
    textAlign: "justify",
    color: "rgba(99, 99, 96, 1)",
    fontFamily: "Hanken Grotesk",
    fontSize: 8,
    fontWeight: 400,
  },
  price: {
    position: "absolute",
    flexShrink: 0,
    top: 187,
    right: 126,
    bottom: 0,
    left: 0,
    textAlign: "justify",
    color: "rgba(99, 99, 96, 1)",
    fontFamily: "Hanken Grotesk",
    fontSize: 8,
    fontWeight: 400,
  },
  myVar: {
    position: "absolute",
    flexShrink: 0,
    top: 176,
    right: 101,
    bottom: 11,
    left: 40,
    textAlign: "justify",
    color: "rgba(99, 99, 96, 1)",
    fontFamily: "Hanken Grotesk",
    fontSize: 8,
    fontWeight: 400,
  },
  abv: {
    position: "absolute",
    flexShrink: 0,
    top: 162,
    right: 88,
    bottom: 18,
    left: 43,
    textAlign: "left",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Hanken Grotesk",
    fontSize: 10,
    fontWeight: 400,
  },
});
