import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import MainButton from "@/components/Buttons/MainButton";

export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  total: string;
  is_ready?: boolean;
  beer_id: string;
  price: number;
  order_id: string;
}

export interface OrderModalCardProps {
  id: string;
  pickup_day: string;
  pickup_time: string;
  final_price: number;
  items: OrderItem[];
  variant?: "onProgress" | "urgent" | "readyToPick";
  onClose: () => void;
  onValidate: (updatedItems: OrderItem[]) => void;
}

const VARIANT_STYLES = {
  onProgress: {
    container: { backgroundColor: "#FDFFD0", borderColor: "#A5D6C8" },
    button: { backgroundColor: "#C9E3D9" },
  },
  urgent: {
    container: { backgroundColor: "#FFF4F4", borderColor: "#FF6B6B" },
    button: { backgroundColor: "#FFBDBD" },
  },
  readyToPick: {
    container: { backgroundColor: "#F0FFF0", borderColor: "#32CD32" },
    button: { backgroundColor: "#98FB98" },
  },
};

export default function OrderModalCard({
  id,
  pickup_day,
  pickup_time,
  final_price,
  items,
  variant = "onProgress",
  onClose,
  onValidate,
}: OrderModalCardProps) {
  const [localItems, setLocalItems] = useState<OrderItem[]>(
    items.map((it) => ({ ...it, is_ready: it.is_ready || false })),
  );

  const toggleReady = (itemId: string) => {
    setLocalItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, is_ready: !it.is_ready } : it)),
    );
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR");

  const variantStyle = VARIANT_STYLES[variant];

  return (
    <View style={[styles.orderCard, { backgroundColor: variantStyle.container.backgroundColor }]}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>

      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>Commande #{id}</Text>
        <View style={styles.orderInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date de retrait</Text>
            <Text style={styles.infoLabel}>Montant total</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>
              {formatDate(pickup_day)} • {pickup_time}
            </Text>
            <Text style={styles.infoValue}>{final_price.toFixed(2)} € TTC</Text>
          </View>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <FlatList
          data={localItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>
                {item.title} x {item.quantity} — {item.total} €
              </Text>
              <TouchableOpacity style={styles.checkbox} onPress={() => toggleReady(item.id)}>
                <Text style={styles.checkboxText}>{item.is_ready ? "✅" : "⬜️"}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <MainButton title="Mettre à jour & passer Ready" onPress={() => onValidate(localItems)} />
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    width: "100%",
    padding: 20,
    borderRadius: 8,
    borderWidth: 0.1,
    borderColor: "#000",
    shadowColor: "rgba(0,0,0,0.25)",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 16,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  orderHeader: {
    marginBottom: 20,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  orderInfo: {
    gap: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 12,
    color: "#555",
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  itemsContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  itemText: {
    fontSize: 14,
    flex: 1,
  },
  checkbox: {
    marginLeft: 10,
  },
  checkboxText: {
    fontSize: 16,
  },
});
