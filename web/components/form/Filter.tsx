import AppIcon from "@/utils/AppIcon";
import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";

export default function FilterButton() {
  return (
    <View style={styles.filterButtonContainer}>
      <Text style={styles.filtrerpar}>{`Filtrer par`}</Text>
      <AppIcon name="filter" size={14} style={styles.filter1} />
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
  filtrerpar: {
    position: "absolute",
    flexShrink: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 25,
    textAlign: "left",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Hanken Grotesk",
    fontSize: 12,
    fontWeight: 400,
  },
  filter1: {
    position: "absolute",
    flexShrink: 0,
    top: 1,
    right: 66,
    left: 0,
    height: 14,
  },
});
