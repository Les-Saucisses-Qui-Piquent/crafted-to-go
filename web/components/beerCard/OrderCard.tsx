import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface OrderCardProps {
  id: string;
  user_id: string;
  brewery_id: string;
  final_price: number;
  status: "new" | "progress" | "ready" | string;
  pickup_day: string;
  pickup_time: string;
  payment_method?: string | null;
  created_at: string;
  updated_at: string;
}

export default function CommandCard({
  final_price,
  status,
  pickup_day,
  pickup_time,
}: OrderCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };
  return (
    <View style={styles.card}>
      <Text style={styles.status}>📦 Statut: {status}</Text>
      <Text style={styles.price}>💰 Total: {final_price.toFixed(2)} €</Text>
      <Text style={styles.pickup}>
        🕒 Pickup: {formatDate(pickup_day)} à {pickup_time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  status: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  price: {
    fontSize: 13,
    marginBottom: 5,
  },
  pickup: {
    fontSize: 12,
    color: "#555",
  },
});
