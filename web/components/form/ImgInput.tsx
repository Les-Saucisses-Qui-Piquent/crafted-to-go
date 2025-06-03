import { COLORS } from "@/constants";
import AppIcon from "@/utils/AppIcon";
import React from "react";
import { View, ImageBackground, Text, StyleSheet } from "react-native";

interface ImgInputProps {
  label: string;
}

export default function ImgInput({ label }: ImgInputProps) {
  return (
    <View style={styles.imgInputContainer}>
      <View style={styles.rectangle26} />
      <AppIcon name="cloud-upload-outline" size={23} color={COLORS.primary} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imgInputContainer: {
    position: "relative",
    flexShrink: 0,
    height: 150,
    width: 150,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 0,
  },
  rectangle26: {
    position: "absolute",
    flexShrink: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderStyle: "solid",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 1,
    borderColor: "rgba(217, 217, 217, 1)",
    borderRadius: 5,
  },
  cloudcomputing2: {
    position: "absolute",
    flexShrink: 0,
    top: 14,
    right: 64,
    left: 64,
    height: 23,
  },
  text: {
    position: "absolute",
    flexShrink: 0,
    top: 67,
    right: 34,
    bottom: 53,
    left: 33,
    textAlign: "center",
    color: "rgba(99, 99, 96, 1)",
    fontFamily: "Hanken Grotesk",
    fontSize: 12,
    fontWeight: 300,
    lineHeight: 10,
  },
});
