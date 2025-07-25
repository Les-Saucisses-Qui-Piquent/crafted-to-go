import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

export interface BreweryProps {
  id: string;
  brewery_id: string;
  has_taproom: boolean;
  image: string | null;
  logo: string | null;
  description: string;
  phone_number: string;
  email: string;
  taproom_hours: any; // jsonb
  opening_hours: any; // jsonb
  social_links: string[] | null;
  title: string;
}

export default function BreweryCardSmall(brewery: BreweryProps) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={brewery.image} />
      <Text style={styles.breweryName}>{brewery.title}</Text>
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
