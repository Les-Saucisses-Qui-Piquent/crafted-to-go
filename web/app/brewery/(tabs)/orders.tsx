import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, ActivityIndicator } from "react-native";
import CommandCard, { OrderCardProps } from "@/components/beerCard/OrderCard";
import FilterBar from "@/components/filterBars/FilterBar";
import { useBreweryData } from "@/contexts/BreweryDataContext";

const filters = ["Nouveau", "En cours", "Prêtes", "Annulées", "toutes"];

export default function Orders() {
  const { orders, loading } = useBreweryData();
  const [filteredOrders, setFilteredOrders] = useState<OrderCardProps[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(0);

  useEffect(() => {
    setFilteredOrders(filterByStatus(orders, filters[selectedFilter]));
  }, [orders, selectedFilter]);

  function filterByStatus(ordersList: OrderCardProps[], filter: string) {
    switch (filter) {
      case "Nouveau":
        return ordersList.filter((order) => order.status === "new");
      case "En cours":
        return ordersList.filter((order) => order.status === "progress");
      case "Prêtes":
        return ordersList.filter((order) => order.status === "ready");
      case "Annulées":
        return ordersList.filter((order) => order.status === "cancelled");
      case "toutes":
      default:
        return ordersList;
    }
  }

  function handleFilterSelect(index: number) {
    setSelectedFilter(index);
  }

  const renderItem = ({ item }: { item: OrderCardProps }) => (
    <View style={styles.orderWrapper}>
      <CommandCard {...item} />
    </View>
  );

  const numColumns = 2;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <StatBlock label="Nouvelles" count={orders.filter((o) => o.status === "new").length} />
        <StatBlock
          label="En cours"
          count={orders.filter((o) => o.status === "in_Progress").length}
        />
        <StatBlock label="Prêtes" count={orders.filter((o) => o.status === "ready").length} />
        <StatBlock label="Annulées" count={orders.filter((o) => o.status === "cancelled").length} />
      </View>

      <View style={styles.filterContainer}>
        <FilterBar filters={filters} selectedIndex={selectedFilter} onSelect={handleFilterSelect} />
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={renderItem}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={{ textAlign: "center" }}>Aucune commande</Text>}
      />
    </View>
  );
}

function StatBlock({ label, count }: { label: string; count: number }) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statCount}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statBlock: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  statCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  statLabel: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  filterContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  listContainer: {
    paddingBottom: 30,
  },
  orderWrapper: {
    width: Dimensions.get("window").width / 2 - 20,
  },
});
