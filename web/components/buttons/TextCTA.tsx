import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface TextCTAProps {
  title: string;
  onPress?: () => void;
  width?: number;
}

export default function TextCTA({ title, onPress, width = 300 }: TextCTAProps) {
  return (
    <TouchableOpacity style={[styles.primaryCTAContainer, { width }]} onPress={onPress}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </View>
      <View style={styles.underline} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryCTAContainer: {
    flexShrink: 0,
    paddingVertical: 10,
    alignItems: "center",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  title: {
    textAlign: "left",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "HankenGrotesk",
    fontSize: 16,
    fontWeight: "400",
    flex: 1,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  underline: {
    width: "90%",
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    marginTop: 8,
  },
});
