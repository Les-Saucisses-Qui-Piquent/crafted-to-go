import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface OrderCardClientProps {
  id: string;
  final_price: number;
  status?: string;
  pickup_day?: string;
  pickup_time?: string;
  created_at?: string;
}

export default function OrderCardClient(props: OrderCardClientProps) {
  const { id, final_price, status, pickup_day, pickup_time, created_at } = props;

  const formatDate = (d?: string) => {
    if (!d) return "-";
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString("fr-FR");
  };

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.id}>Commande #{id}</Text>
        <Text style={styles.status}>Statut : {status ?? "inconnue"}</Text>
        <Text style={styles.price}>Total : {Number(final_price).toFixed(2)} €</Text>
        <Text style={styles.pickup}>
          Retrait : {formatDate(pickup_day)} {pickup_time ? `à ${pickup_time}` : ""}
        </Text>
        {created_at ? (
          <Text style={styles.small}>Créée le : {new Date(created_at).toLocaleString()}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  info: { flex: 1 },
  id: { fontWeight: "700", marginBottom: 6 },
  status: { fontSize: 14, marginBottom: 4 },
  price: { fontSize: 13, marginBottom: 4 },
  pickup: { fontSize: 12, color: "#555", marginBottom: 6 },
  small: { color: "#666", fontSize: 12 },
});
