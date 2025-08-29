import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import AppIcon from "@/utils/AppIcon";

interface BeerCardActionsMenuProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onEditStock: () => void;
  onDelete: () => void;
}

export default function BeerCardActionsMenu({
  visible,
  onClose,
  onEdit,
  onEditStock,
  onDelete,
}: BeerCardActionsMenuProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItemEdit} onPress={onEdit}>
            <AppIcon name="pencil" size={20} color="#222" />
            <Text style={styles.menuTextEdit}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItemStock} onPress={onEditStock}>
            <AppIcon name="cube" size={20} color="#222" />
            <Text style={styles.menuTextStock}>Modifier stock</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItemDelete} onPress={onDelete}>
            <AppIcon name="trash" size={20} color="#C00" />
            <Text style={styles.menuTextDelete}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuCard: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItemEdit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D2EBE4",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  menuItemStock: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  menuItemDelete: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9D6D6",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  menuTextEdit: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  menuTextStock: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  menuTextDelete: {
    fontSize: 16,
    color: "#C00",
    fontWeight: "500",
  },
});
