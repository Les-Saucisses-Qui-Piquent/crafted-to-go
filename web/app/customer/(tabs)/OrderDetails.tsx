import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useLocalSearchParams, RelativePathString, useRouter } from "expo-router";
import MainButton from "@/components/Buttons/MainButton";

interface OrderDetail {
  id?: string;
  order_id?: string;
  beer_id: string;
  quantity: number;
  price: number;
  is_ready?: boolean;
}

interface OrderResponse {
  id: string;
  user_id?: string;
  brewery_id?: string;
  final_price: number;
  pickup_day?: string;
  pickup_time?: string;
  payment_method?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
  details?: OrderDetail[];
}

export default function OrderDetails() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Aucun identifiant de commande fourni.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const API_URL = process.env.API_URL as string;
        const res = await fetch(`${API_URL.replace(/\/$/, "")}/orders/${orderId}`);
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} ${t}`);
        }
        const json = await res.json();
        const data: OrderResponse = json.order || json.data || json || ({} as OrderResponse);

        if (!data.details && json.details) {
          data.details = json.details;
        }

        setOrder(data);
      } catch (err) {
        console.error("fetch order error", err);
        setError("Impossible de récupérer la commande.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatPrice = (p?: number) => (p != null ? `${p.toFixed(2)} €` : "-");

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Chargement de la commande...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Commande introuvable.</Text>
      </View>
    );
  }

  const totalItems = order.details?.reduce((s, d) => s + d.quantity, 0) ?? 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détail de la commande</Text>
      <Text style={styles.sub}>ID : {order.id}</Text>
      <Text style={styles.sub}>Statut : {order.status ?? "-"}</Text>
      <Text style={styles.sub}>
        Récupération : {order.pickup_day ?? "-"} {order.pickup_time ?? ""}
      </Text>

      <View style={{ height: 12 }} />

      <FlatList
        data={order.details || []}
        keyExtractor={(d, i) => d.id ?? `${d.beer_id}_${i}`}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.beer_id}</Text>
              <Text style={styles.itemMeta}>Quantité: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Aucun détail de commande.</Text>}
      />

      <View style={{ marginTop: 16 }}>
        <Text style={styles.total}>Articles : {totalItems}</Text>
        <Text style={styles.total}>Total : {formatPrice(order.final_price)}</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <MainButton
          title="Retour aux commandes"
          onPress={() =>
            router.push({
              pathname: "customer" as unknown as RelativePathString,
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  sub: { fontSize: 14, color: "#666", marginBottom: 2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemTitle: { fontSize: 16, fontWeight: "600" },
  itemMeta: { fontSize: 12, color: "#666", marginTop: 4 },
  itemPrice: { fontSize: 14, fontWeight: "700" },
  total: { fontSize: 16, fontWeight: "700", marginTop: 4 },
});
