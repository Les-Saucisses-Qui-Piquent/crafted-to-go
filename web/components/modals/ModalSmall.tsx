import AppIcon from "@/utils/AppIcon";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

interface ModalSmallProps {
  onClose?: () => void;
  children?: React.ReactNode;
}

export default function ModalSmall({ onClose, children }: ModalSmallProps) {
  return (
    <View style={styles.modalSmallContainer}>
      <View style={styles.modalSmall}>
        <TouchableOpacity style={styles.croix1} onPress={onClose}>
          <AppIcon name="close" size={23} color="#636360" />
        </TouchableOpacity>
        <View style={styles.content}>{children}</View>
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
    backgroundColor: "rgba(0,0,0,0.15)", // Ajoute un fond semi-transparent
    justifyContent: "center",
  },
  modalSmall: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 159,
    width: 173,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  croix1: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 6,
  },
  content: {
    marginTop: 36,
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
