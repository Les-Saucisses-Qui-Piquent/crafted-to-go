import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { OrderFlatList } from "@/components/modals/OrderCard";
import type { Order } from "@/components/modals/OrderCard"; // 🔁 Le bon type

export interface OrderProps {
  orders: Order[]; // ✅ Ceci doit être un tableau
}

const OrdersScreen = ({ orders }: OrderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Commandes</Text>
      <OrderFlatList orders={orders} horizontal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "Hanken Grotesk",
  },
});

export default OrdersScreen;
