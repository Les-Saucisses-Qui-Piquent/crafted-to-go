import AppIcon from "@/utils/AppIcon";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FilterButton() {
  return (
    <View style={styles.filterButtonContainer}>
      <Text style={styles.filter}>{"Filtrer par"}</Text>
      <AppIcon name="filter" size={14} />
    </View>
  );
}

const styles = StyleSheet.create({
  filterButtonContainer: {
    position: "relative",
    flexShrink: 0,
    height: 16,
    width: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 0,
  },
  filter: {
    position: "absolute",
    flexShrink: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 25,
    textAlign: "left",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "HankenGrotesk",
    fontSize: 12,
    fontWeight: 400,
  },
});
