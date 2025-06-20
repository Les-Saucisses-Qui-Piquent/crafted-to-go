import AppIcon from "@/utils/AppIcon";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

export interface BeerCardProps {
  title?: string;
  style?: string;
  color?: string;
  abv?: string;
  price?: string;
  stock?: number;
  imgPath?: string;
  description?: string;
}

export default function BeerCard({
  title,
  style,
  color,
  abv,
  price,
  stock,
  description,
  imgPath,
}: BeerCardProps) {
  return (
    <View style={styles.container}>
      {/* Menu Icon */}
      <TouchableOpacity style={styles.img}>
        <AppIcon name="ellipsis-vertical" size={23} color="#636360" />
      </TouchableOpacity>

      {/* Beer Info */}
      <Text style={styles.stockLabel}>Stock en ligne</Text>
      <Text style={styles.productName}>{title}</Text>

      {/* Beer Attributes */}
      <Text style={styles.attributeLabel}>Style</Text>
      <Text style={styles.attributeValue}>{style}</Text>
      <Text style={styles.attributeLabel2}>Couleur</Text>
      <Text style={styles.attributeValue2}>{color}</Text>
      <Text style={styles.attributeLabel3}>Taux</Text>
      <Text style={styles.attributeValue3}>{abv}</Text>
      <Text style={styles.attributeLabel4}>PDV</Text>
      <Text style={styles.price}>{price}</Text>

      <Text style={styles.description}>{description}</Text>

      {/* Decorative Icon/Image */}
      <Image style={styles.pointsIcon} source={imgPath} />

      {/* Stock Number */}
      <Text style={styles.stockNumber}>{stock}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexShrink: 0,
    height: 148,
    width: 336,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  img: {
    position: "absolute",
    top: 0,
    left: 0,
    shadowColor: "rgba(0, 0, 0, 0.4)",
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    borderRadius: 5,
  },
  stockLabel: {
    position: "absolute",
    top: 114,
    left: 157,
    color: "#000",
    fontFamily: "HankenGrotesk",
    fontSize: 12,
    fontWeight: "300",
    letterSpacing: -0.36,
    lineHeight: 34,
  },
  productName: {
    position: "absolute",
    top: 14,
    left: 157,
    color: "#000",
    fontFamily: "HankenGrotesk",
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: -0.63,
    lineHeight: 34,
  },
  attributeLabel: {
    position: "absolute",
    top: 39,
    left: 158,
    color: "#636360",
    fontFamily: "HankenGrotesk",
    fontSize: 10,
    fontWeight: "300",
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  attributeValue: {
    position: "absolute",
    top: 49,
    left: 158,
    color: "#000",
    fontFamily: "HankenGrotesk",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  attributeLabel2: {
    position: "absolute",
    top: 39,
    left: 193,
    color: "#636360",
    fontFamily: "HankenGrotesk",
    fontSize: 10,
    fontWeight: "300",
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  attributeValue2: {
    position: "absolute",
    top: 49,
    left: 193,
    color: "#000",
    fontFamily: "HankenGrotesk",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  attributeLabel3: {
    position: "absolute",
    top: 39,
    left: 244,
    color: "#636360",
    fontFamily: "HankenGrotesk",
    fontSize: 10,
    fontWeight: "300",
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  attributeValue3: {
    position: "absolute",
    top: 49,
    left: 244,
    color: "#000",
    fontFamily: "HankenGrotesk",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  attributeLabel4: {
    position: "absolute",
    top: 39,
    left: 282,
    color: "#636360",
    fontFamily: "HankenGrotesk",
    fontSize: 10,
    fontWeight: "300",
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  price: {
    position: "absolute",
    top: 49,
    left: 282,
    color: "#000",
    fontFamily: "HankenGrotesk",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  description: {
    position: "absolute",
    top: 67,
    left: 156,
    right: 5,
    color: "#A09C9C",
    fontFamily: "HankenGrotesk",
    fontSize: 8,
    fontWeight: "300",
    lineHeight: 8,
    textAlign: "justify",
  },
  pointsIcon: {
    position: "absolute",
    top: 13,
    left: 320,
    height: 16,
    width: 16,
  },
  stockNumber: {
    position: "absolute",
    top: 114,
    left: 236,
    color: "#000",
    fontFamily: "Hanken Grotesk",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: -0.36,
    lineHeight: 34,
  },
});
