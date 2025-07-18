import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
const isTabletDevice = () => {
  const { width } = Dimensions.get("window");
  return width >= 600;
};

interface BeerCardLargeProps {
  image: string;
  name?: string;
  description?: string;
  style?: string;
  color?: string;
  abv?: string;
  price?: string;
  stock?: string | number;
  isTablet?: boolean;
}

export default function BeerCardLarge({
  image,
  name,
  description,
  style: beerStyle,
  color,
  abv,
  price,
  stock,
  isTablet = isTabletDevice(),
}: BeerCardLargeProps) {
  const styles = isTablet ? tabletStyles : mobileStyles;

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: image }} />
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#D9D9D9",
          marginVertical: 16,
        }}
      />
      {/* Attributes */}
      <View style={styles.attributeBlock1}>
        <Text style={styles.attributeLabel}>Style</Text>
        <Text style={styles.attributeValue}>{beerStyle}</Text>
      </View>
      <View style={styles.attributeBlock2}>
        <Text style={styles.attributeLabel}>Couleur</Text>
        <Text style={styles.attributeValue}>{color}</Text>
      </View>
      <View style={styles.attributeBlock3}>
        <Text style={styles.attributeLabel}>Taux</Text>
        <Text style={styles.attributeValue}>{abv}</Text>
      </View>
      <View style={styles.attributeBlock4}>
        <Text style={styles.attributeLabel}>Prix</Text>
        <Text style={styles.attributeValue}>{price}</Text>
      </View>
      <View style={styles.attributeBlock5}>
        <Text style={styles.attributeLabel}>Stock</Text>
        <Text style={styles.attributeValue}>{stock}</Text>
      </View>
    </View>
  );
}

const mobileStyles = StyleSheet.create({
  container: {
    position: "relative",
    flexShrink: 0,
    height: 229,
    width: 714,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  image: {
    position: "absolute",
    left: 0,
    right: 371,
    height: 229,
    borderRadius: 12,
    overflow: "hidden",
  },
  title: {
    position: "absolute",
    top: 0,
    left: 365,
    right: 6,
    color: "#1D1D1B",
    fontFamily: "Hanken Grotesk",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.96,
    lineHeight: 34,
    textAlign: "left",
  },
  description: {
    position: "absolute",
    top: 81,
    left: 365,
    right: 8,
    color: "#636360",
    fontFamily: "Hanken Grotesk",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
    textAlign: "justify",
  },
  divider: {
    position: "absolute",
    top: 182,
    left: 366,
    right: 3,
    overflow: "visible",
  },
  attributeBlock1: { position: "absolute", top: 193, left: 367, width: 63 },
  attributeBlock2: { position: "absolute", top: 193, left: 433, width: 63 },
  attributeBlock3: { position: "absolute", top: 193, left: 517, width: 63 },
  attributeBlock4: { position: "absolute", top: 193, left: 598, width: 63 },
  attributeBlock5: { position: "absolute", top: 193, left: 679, width: 63 },
  attributeLabel: {
    color: "#636360",
    fontFamily: "Hanken Grotesk",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 18,
    textAlign: "left",
  },
  attributeValue: {
    color: "#000",
    fontFamily: "Hanken Grotesk",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 18,
    textAlign: "left",
    marginTop: 2,
  },
});

// Tablet styles
const tabletStyles = StyleSheet.create({
  container: {
    position: "relative",
    flexShrink: 0,
    height: 520,
    width: 355,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  image: {
    position: "absolute",
    left: 1,
    right: 3,
    height: 234,
    borderRadius: 12,
    overflow: "hidden",
  },
  title: {
    position: "absolute",
    top: 260,
    left: 0,
    right: 0,
    color: "#1D1D1B",
    fontFamily: "Hanken Grotesk",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.96,
    lineHeight: 34,
    textAlign: "left",
  },
  description: {
    position: "absolute",
    top: 311,
    left: 0,
    right: 2,
    color: "#636360",
    fontFamily: "Hanken Grotesk",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
    textAlign: "justify",
  },
  divider: {
    position: "absolute",
    top: 410,
    left: 0,
    right: 3,
    overflow: "visible",
  },
  attributeBlock1: { position: "absolute", top: 436, left: 1, width: 63 },
  attributeBlock2: { position: "absolute", top: 436, left: 68, width: 63 },
  attributeBlock3: { position: "absolute", top: 436, left: 154, width: 63 },
  attributeBlock4: { position: "absolute", top: 436, left: 237, width: 63 },
  attributeBlock5: { position: "absolute", top: 436, left: 319, width: 63 },
  attributeLabel: {
    color: "#636360",
    fontFamily: "Hanken Grotesk",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 18,
    textAlign: "left",
  },
  attributeValue: {
    color: "#000",
    fontFamily: "Hanken Grotesk",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 18,
    textAlign: "left",
    marginTop: 2,
  },
});
