import React from "react";
import { View, Text, StyleSheet, FlatList, ListRenderItem } from "react-native";
import CommandCard from "@/components/beerCard/OrderCard";

interface OrderItem {
  id: string;
  title: string;
  number: number;
  total: string;
  image?: string;
}

interface OrdersScreenProps {
  orders: OrderItem[];
}

const OrdersScreen = ({ orders }: OrdersScreenProps) => {
  const renderItem: ListRenderItem<OrderItem> = ({ item }) => (
    <View style={styles.itemContainer}>
      <CommandCard title={item.title} number={item.number} total={item.total} image={item.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Commandes</Text>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  itemContainer: {
    paddingVertical: 4,
  },
  separator: {
    height: 12,
  },
});

export default OrdersScreen;
