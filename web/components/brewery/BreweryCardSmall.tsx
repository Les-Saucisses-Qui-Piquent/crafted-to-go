import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface BreweryCardSmallProps {
  image?: string;
  title?: string;
}

export default function BreweryCardSmall({ image, title }: BreweryCardSmallProps) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />
      <Text style={styles.breweryName}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexShrink: 0,
    height: 201,
    width: 171,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 171,
    height: 171,
  },
  imageBorder: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  breweryName: {
    marginTop: 8,
    marginBottom: 12,
    color: "#000",
    fontFamily: "Manrope",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.36,
    lineHeight: 18,
    textAlign: "left",
    width: "100%",
    paddingLeft: 8,
  },
});
