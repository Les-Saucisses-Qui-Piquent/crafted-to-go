import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useClientData } from "@/contexts/CostumerDataProvider";
import OrderCardClient from "@/components/OrderCardClient";

export interface Order {
  id: string;
  user_id?: string;
  brewery_id?: string;
  final_price: number;
  pickup_day?: string; // date
  pickup_time?: string;
  created_at?: string;
  updated_at?: string;
  payment_method?: string | null;
  status?: string;
}

const Orders = () => {
  const { user } = useAuth();
  const { getOrdersByUserId } = useClientData();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      if (!user?.id) {
        if (mounted) {
          setOrders([]);
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await getOrdersByUserId(user.id);
        if (mounted) setOrders(res ?? []);
      } catch (err) {
        console.error("Erreur fetch orders:", err);
        if (mounted) setError("Impossible de charger les commandes.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      mounted = false;
    };
  }, [user?.id, getOrdersByUserId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Chargement des commandes...</Text>
      </View>
    );
  }

  if (!user?.id) {
    return (
      <View style={styles.center}>
        <Text>Vous devez être connecté pour voir vos commandes.</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Aucune commande trouvée.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={orders}
      keyExtractor={(o) => String(o.id)}
      renderItem={({ item }) => (
        <OrderCardClient
          id={String(item.id)}
          final_price={Number(item.final_price ?? 0)}
          status={item.status ?? "new"}
          pickup_day={item.pickup_day}
          pickup_time={item.pickup_time}
          created_at={item.created_at}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  loadingText: { marginTop: 8 },
  errorText: { color: "red" },
});

export default Orders;
