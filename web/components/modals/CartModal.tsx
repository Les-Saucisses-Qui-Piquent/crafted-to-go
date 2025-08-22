import React from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import CartScreen from "../CartScreen";

interface CartModalProps {
  visible: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeText}>Fermer</Text>
          </TouchableOpacity>
        </View>

        {/* Réutilise votre écran de panier existant */}
        <CartScreen />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 48,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  closeText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CartModal;
