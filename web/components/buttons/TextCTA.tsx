import AppIcon from "@/utils/AppIcon";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface TextCTAProps {
  title: string;
  onPress?: () => void;
}

export default function TextCTA({ title, onPress }: TextCTAProps) {
  return (
    <TouchableOpacity style={styles.primaryCTAContainer} onPress={onPress}>
      <Text style={styles.orders}>{title}</Text>
      <AppIcon name="arrow-forward" size={23} color="#000" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryCTAContainer: {
    position: "relative",
    flexShrink: 0,
    height: 29,
    width: 252,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 0,
  },
  orders: {
    position: "absolute",
    flexShrink: 0,
    top: 4,
    right: 26,
    bottom: 10,
    left: 0,
    textAlign: "left",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Hanken Grotesk",
    fontSize: 15,
    fontWeight: 500,
  },
});
