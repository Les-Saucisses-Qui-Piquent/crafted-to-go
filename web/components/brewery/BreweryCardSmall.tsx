import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { OpeningHours } from "@/app/registerBrewery";

export interface BreweryProps {
  id: string;
  brewery_id: string;
  has_taproom: boolean;
  image: string | null;
  logo: string | null;
  description: string;
  phone_number: string;
  email: string;
  taproom_hours: OpeningHours;
  opening_hours: OpeningHours;
  social_links: string[] | null;
  name: string;
  address: {
    line_1: string;
    line_2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

export default function BreweryCardSmall(props: BreweryProps) {
  const brewery = props;

  return (
    <View style={styles.container}>
      {brewery.logo ? (
        <Image style={styles.image} source={{ uri: brewery.logo }} />
      ) : brewery.image ? (
        <Image style={styles.image} source={{ uri: brewery.image }} />
      ) : null}
      <Text style={styles.breweryName}>{brewery.name}</Text>
      {brewery.address && brewery.address.city && (
        <Text style={styles.address}>{brewery.address.city}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexShrink: 0,
    height: 210,
    width: 250,
    backgroundColor: "#fff",
    overflow: "hidden",
    //alignItems: "center",
    justifyContent: "flex-end",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    height: 150,
    borderRadius: 5,
  },
  breweryName: {
    marginTop: 10,
    color: "#000",
    fontFamily: "HankenGrotesk",
    textTransform: "capitalize",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "left",
    width: "100%",
    //paddingHorizontal: 8,
  },
  address: {
    color: "#666",
    fontFamily: "HankenGrotesk",
    fontSize: 12,
    fontWeight: "300",
    textAlign: "left",
    width: "100%",
    textTransform: "uppercase",
    marginBottom: 10,
  },
});
