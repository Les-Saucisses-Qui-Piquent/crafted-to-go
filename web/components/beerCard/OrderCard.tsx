import React, { useState } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import MainButton from "@/components/Buttons/MainButton";
import { useBreweryData } from "@/contexts/BreweryDataContext";
import OrderModalCard, { OrderItem } from "../modals/OrderModal";

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

export default function CommandCard(props: OrderCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { orderDetails } = useBreweryData();
  const { id, final_price, status, pickup_day, pickup_time } = props;
  const items: OrderItem[] = orderDetails[id] || [];

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR");

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.status}>📦 Statut: {status}</Text>
        <Text style={styles.price}>💰 Total: {final_price.toFixed(2)} €</Text>
        <Text style={styles.pickup}>
          🕒 Pickup: {formatDate(pickup_day)} à {pickup_time}
        </Text>
        <MainButton title="Détails de la commande" onPress={() => setModalVisible(true)} />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <OrderModalCard
              id={id}
              pickup_day={pickup_day}
              pickup_time={pickup_time}
              final_price={final_price}
              items={items}
              onClose={() => setModalVisible(false)}
              onValidate={(updatedItems) => {
                // TODO : Appel à ton endpoint pour valider les items puis mettre à jour l'état
                console.log("Valider la commande", updatedItems);
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </>
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
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    maxHeight: "90%",
  },
});
