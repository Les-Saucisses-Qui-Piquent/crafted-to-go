import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { Image } from "expo-image";
import MainButton from "@/components/Buttons/MainButton";
import SecondaryCTA from "../Buttons/SecondaryCTA";

export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  total: string;
  is_ready?: boolean;
  beer_id: string;
  price: number;
  order_id: string;
  image: string;
}

export interface OrderModalCardProps {
  id: string;
  pickup_day: string;
  pickup_time: string;
  final_price: number;
  items: OrderItem[];
  variant?: "onProgress" | "urgent" | "readyToPick";
  onClose: () => void;
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
}: OrderModalCardProps) {
  const [localItems, setLocalItems] = useState<OrderItem[]>(
    items.map((it) => ({ ...it, is_ready: it.is_ready ?? false })),
  );

  const onValidate = (updatedItems: OrderItem[]) => {
    Alert.alert(
      "Commande mise à jour",
      `Articles prêts: ${updatedItems.filter((i) => i.is_ready).length}`,
    );
  };

  const onContactClient = () => {
    Alert.alert("Contacter le client", "Ouvre l'écran de contact");
  };

  const onCancelOrder = () => {
    Alert.alert("Annuler la commande", "Êtes-vous sûr de vouloir annuler cette commande ?", [
      { text: "Non", style: "cancel" },
      { text: "Oui", style: "destructive", onPress: () => Alert.alert("Commande annulée") },
    ]);
  };

  const toggleReady = (itemId: string) => {
    setLocalItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, is_ready: !it.is_ready } : it)),
    );
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR");

  const variantStyle = VARIANT_STYLES[variant];

  return (
    <View
      style={[
        styles.orderCard,
        {
          backgroundColor: variantStyle.container.backgroundColor,
          borderColor: variantStyle.container.borderColor,
        },
      ]}
    >
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
              <Image
                source={item.image}
                style={styles.itemImage}
                contentFit="cover"
                transition={1000}
              />
              <Text style={[styles.itemText, item.is_ready ? styles.itemReady : null]}>
                {item.title} x {item.quantity} — {item.total} €
              </Text>
              <TouchableOpacity
                style={[styles.checkbox, item.is_ready && styles.checkboxChecked]}
                onPress={() => toggleReady(item.id)}
              >
                <Text style={styles.checkboxText}>{item.is_ready ? "✅" : "⬜️"}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <MainButton title="Passer la commande en prête" onPress={() => onValidate(localItems)} />

      <View style={styles.secondaryButtonsRow}>
        <SecondaryCTA
          title="Contacter le client"
          onPress={onContactClient}
          style={styles.secondaryButtonLeft}
        />
        <SecondaryCTA
          title="Annuler la commande"
          onPress={onCancelOrder}
          style={styles.secondaryButtonRight}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    width: "100%",
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
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
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
  },
  orderHeader: {
    marginBottom: 20,
  },
  orderTitle: {
    fontSize: 22,
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
    maxHeight: 250,
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  itemReady: {
    textDecorationLine: "line-through",
    color: "#6c757d",
  },
  checkbox: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
  },
  checkboxChecked: {
    borderColor: "#32CD32",
    backgroundColor: "#d0f0d0",
  },
  checkboxText: {
    fontSize: 18,
  },
  secondaryButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  secondaryButtonLeft: {
    flex: 1,
    backgroundColor: "#ddd",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  secondaryButtonRight: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FF4D4D",
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },
});
