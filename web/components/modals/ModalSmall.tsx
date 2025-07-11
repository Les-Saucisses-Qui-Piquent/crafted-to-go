import AppIcon from "@/utils/AppIcon";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

export default function ModalSmall() {
  return (
    <View style={styles.modalSmallContainer}>
      <View style={styles.modalSmall}>
        <TouchableOpacity style={styles.croix1}>
          <AppIcon name="close" size={23} color="#636360" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalSmallContainer: {
    position: "relative",
    flexShrink: 0,
    height: 159,
    width: 173,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 0,
  },
  modalSmall: {
    position: "absolute",
    flexShrink: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    rowGap: 0,
  },
  group38: {
    position: "absolute",
    flexShrink: 0,
    height: 159,
    width: 173,
  },
  croix1: {
    position: "absolute",
    flexShrink: 0,
    top: 11,
    right: 20,
    left: 145,
    height: 8,
  },
});
