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
    height: 200,
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
    marginBottom: 10,
    color: "#000",
    fontFamily: "HankenGrotesk",
    textTransform: "capitalize",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "left",
    width: "100%",
    //paddingHorizontal: 8,
  },
});
