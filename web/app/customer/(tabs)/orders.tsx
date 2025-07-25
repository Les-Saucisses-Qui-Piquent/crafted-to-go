import React from "react";
import { View, Text, StyleSheet, FlatList, ListRenderItem, TouchableOpacity } from "react-native";
import CommandCard from "@/components/beerCard/OrderCard";
import { RelativePathString, useRouter } from "expo-router";
import { useOrders } from "@/contexts/OrderContext"; // adapte le chemin si besoin

interface OrderItem {
  id: string;
  title: string;
  number: number;
  total: string;
  image?: string;
}

const OrdersScreen = () => {
  const router = useRouter();
  const { orders } = useOrders();

  const adaptedOrders: OrderItem[] = orders.map((order) => ({
    id: order.id,
    title: order.customerName,
    number: order.items.reduce((acc, item) => acc + item.quantity, 0),
    total: order.totalPrice.toFixed(2) + " €",
    image: order.items[0]?.image,
  }));

  const handlePress = (orderId: string) => {
    router.push({
      pathname: "/customer/OrderDetails" as unknown as RelativePathString,
      params: { id: orderId },
    });
  };

  const renderItem: ListRenderItem<OrderItem> = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.id)}>
      <View style={styles.itemContainer}>
        <CommandCard
          title={item.title}
          number={item.number}
          total={item.total}
          image={item.image}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Commandes</Text>
      <FlatList
        data={adaptedOrders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => <Text>Aucune commande disponible.</Text>}
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
