import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams, RelativePathString } from "expo-router";
import MainButton from "@/components/Buttons/MainButton";
import { OrderItem } from "@/components/modals/OrderModal";

export default function OrderDetails({ id, number, total }: OrderItem) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détail de la commande {id}</Text>
      <Text style={styles.detail}>Nombre de bières : {number}</Text>
      <Text style={styles.detail}>Total : {total}</Text>
      <MainButton
        title="Valider cette commande"
        onPress={() => {
          router.push({
            pathname: "customer/payment/CheckoutConfirmation" as unknown as RelativePathString,
            params: { orderId: id },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
});
