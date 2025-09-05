import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import CommandCard, { OrderCardProps } from "@/components/OrderCard";
import FilterBar from "@/components/filterBars/FilterBar";
import { useBreweryData } from "@/contexts/BreweryDataContext";
import { COLORS, SIZES } from "@/constants";

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
        <StatBlock label="En cours" count={orders.filter((o) => o.status === "progress").length} />
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
  container: { flex: 1, backgroundColor: COLORS.secondaryWhite, padding: SIZES.padding3 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.padding2,
    gap: SIZES.padding2,
  },
  statBlock: {
    backgroundColor: COLORS.grayscale100,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.gray2,
    marginTop: 2,
    fontWeight: "500",
  },
  filterContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
    gap: SIZES.padding2,
  },
  listContainer: {
    paddingBottom: 30,
  },
  orderWrapper: {
    flex: 1,
    marginBottom: SIZES.padding2,
  },
  emptyText: {
    color: COLORS.gray,
    textAlign: "center",
    marginTop: SIZES.padding3,
  },
});
