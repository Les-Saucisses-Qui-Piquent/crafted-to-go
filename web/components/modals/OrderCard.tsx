import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ListRenderItem } from "react-native";
import CommandCard from "../beerCard/CommandCard";

type OrderCardVariant = "onProgress" | "urgent" | "readyToPick";

interface OrderItem {
  id: string;
  title: string;
  number: number;
  total: string;
  image?: string;
}

interface OrderCardProps {
  orderNumber: string;
  pickupDate: string;
  pickupTime: string;
  totalPrice: string;
  items: OrderItem[];
  variant?: OrderCardVariant;
  onValidate?: () => void;
  onClose?: () => void;
}

// Enhanced interface for order lists
interface Order extends OrderCardProps {
  id: string;
}

interface OrderListProps {
  orders: Order[];
  horizontal?: boolean;
  showsScrollIndicator?: boolean;
}

const VARIANT_STYLES = {
  onProgress: {
    container: { backgroundColor: "#FDFFD0", borderColor: "#A5D6C8" },
    button: { backgroundColor: "#C9E3D9" },
  },
  urgent: {
    container: { backgroundColor: "#FFF4F4", borderColor: "#FF6B6B" },
    button: { backgroundColor: "#FFBDBD" },
  },
  readyToPick: {
    container: { backgroundColor: "#F0FFF0", borderColor: "#32CD32" },
    button: { backgroundColor: "#98FB98" },
  },
};

// Main OrderCard Component
function OrderCard({
  orderNumber,
  pickupDate,
  pickupTime,
  totalPrice,
  items,
  variant = "onProgress",
  onValidate,
  onClose,
}: OrderCardProps) {
  const variantStyle = VARIANT_STYLES[variant];

  const renderOrderItem: ListRenderItem<OrderItem> = ({ item }) => (
    <CommandCard title={item.title} number={item.number} total={item.total} image={item.image} />
  );

  return (
    <View style={[styles.orderCard, { backgroundColor: variantStyle.container.backgroundColor }]}>
      {/* Close button */}
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      )}

      {/* Order Header */}
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>Order #{orderNumber}</Text>

        <View style={styles.orderInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pick up date</Text>
            <Text style={styles.infoLabel}>Total payment</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>
              {pickupDate} - {pickupTime}
            </Text>
            <Text style={styles.infoValue}>{totalPrice} TTC</Text>
          </View>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.itemsContainer}>
        <FlatList
          data={items}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        />
      </View>

      {/* Validate Button */}
      {onValidate && (
        <TouchableOpacity
          style={[styles.validateButton, { backgroundColor: variantStyle.button.backgroundColor }]}
          onPress={onValidate}
        >
          <Text style={styles.validateButtonText}>Valider</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// FlatList Implementation for multiple OrderCards
export function OrderFlatList({
  orders,
  horizontal = false,
  showsScrollIndicator = true,
}: OrderListProps) {
  const renderOrderCard: ListRenderItem<Order> = ({ item }) => (
    <OrderCard
      orderNumber={item.orderNumber}
      pickupDate={item.pickupDate}
      pickupTime={item.pickupTime}
      totalPrice={item.totalPrice}
      items={item.items}
      variant={item.variant}
      onValidate={item.onValidate}
      onClose={item.onClose}
    />
  );

  return (
    <FlatList
      data={orders}
      renderItem={renderOrderCard}
      keyExtractor={(item) => item.id}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={showsScrollIndicator}
      showsVerticalScrollIndicator={showsScrollIndicator}
      contentContainerStyle={horizontal ? styles.horizontalList : styles.verticalList}
      ItemSeparatorComponent={() => <View style={styles.orderSeparator} />}
    />
  );
}

// Map Implementation for multiple OrderCards
export function OrderMapList({ orders }: Pick<OrderListProps, "orders">) {
  return (
    <View style={styles.mapContainer}>
      {orders.map((order) => (
        <View key={order.id} style={styles.mappedOrderWrapper}>
          <OrderCard
            orderNumber={order.orderNumber}
            pickupDate={order.pickupDate}
            pickupTime={order.pickupTime}
            totalPrice={order.totalPrice}
            items={order.items}
            variant={order.variant}
            onValidate={order.onValidate}
            onClose={order.onClose}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    width: 343,
    minHeight: 340,
    borderRadius: 7,
    borderWidth: 0.1,
    borderColor: "rgba(0, 0, 0, 1)",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 5, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 5,
    padding: 20,
    marginVertical: 8,
  },
  closeButton: {
    position: "absolute",
    top: 11,
    right: 15,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 1)",
  },
  orderHeader: {
    marginBottom: 20,
  },
  orderTitle: {
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.57,
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Hanken Grotesk",
    marginBottom: 8,
  },
  orderInfo: {
    gap: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "300",
    letterSpacing: -0.3,
    color: "rgba(99, 99, 96, 1)",
    fontFamily: "Hanken Grotesk",
  },
  infoValue: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Hanken Grotesk",
  },
  itemsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  commandCardItem: {
    marginVertical: 4,
  },
  itemSeparator: {
    height: 8,
  },
  validateButton: {
    height: 24,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 2,
  },
  validateButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Hanken Grotesk",
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  verticalList: {
    paddingVertical: 8,
  },
  orderSeparator: {
    width: 16,
  },
  mapContainer: {
    gap: 16,
  },
  mappedOrderWrapper: {
    alignItems: "center",
  },
});

export default OrderCard;
