import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface SecondaryCTAProps {
  title: string;
  isBlack?: boolean;
  tablet?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function SecondaryCTA({
  title,
  isBlack = false,
  tablet = false,
  onPress,
  style,
}: SecondaryCTAProps) {
  let backgroundColor = "rgba(252, 248, 248, 1)";
  if (isBlack) backgroundColor = "#000";
  let textColor = isBlack ? "#FFF" : "#000";
  let width = tablet ? 294 : 128;

  return (
    <TouchableOpacity style={[styles.secondaryCTAContainer, { width }, style]} onPress={onPress}>
      <View style={[styles.rectangle21, { backgroundColor }]} />
      <Text style={[styles.orderDetails, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  secondaryCTAContainer: {
    position: "relative",
    flexShrink: 0,
    height: 27,
    width: 128,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 0,
  },
  rectangle21: {
    position: "absolute",
    flexShrink: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderStyle: "solid",
    borderWidth: 0.30000001192092896,
    borderColor: "rgba(0, 0, 0, 1)",
    borderRadius: 2,
  },
  orderDetails: {
    position: "absolute",
    flexShrink: 0,
    top: 6,
    right: 12,
    bottom: 6,
    left: 11,
    textAlign: "center",
    fontFamily: "HankenGrotesk",
    fontSize: 12,
    fontWeight: 600,
  },
});
