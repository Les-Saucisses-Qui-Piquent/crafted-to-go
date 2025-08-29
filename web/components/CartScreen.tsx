import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter, RelativePathString } from "expo-router";
import { useCart, CartItem } from "@/contexts/CartContext";
// import { useOrders } from "@/contexts/OrderContext"; // <--- removed: creation done dans CheckoutConfirmation
import MainButton from "@/components/Buttons/MainButton";

export default function CartScreen({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const { items, totalPrice, totalItems, updateQuantity, removeItem } = useCart();

  const handleIncrease = (item: CartItem) => updateQuantity(item.id, item.quantity + 1);
  const handleDecrease = (item: CartItem) => updateQuantity(item.id, item.quantity - 1);
  const handleRemove = (id: string) =>
    Alert.alert("Supprimer", "Voulez-vous supprimer cet article ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => removeItem(id) },
    ]);

  const handleCheckout = () => {
    if (!items || items.length === 0) {
      Alert.alert("Panier vide", "Ajoutez des articles avant de valider la commande.");
      return;
    }

    if (onClose) onClose();

    router.push({
      pathname: "customer/payment/CheckoutConfirmation" as unknown as RelativePathString,
    });
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.breweryName} • {item.variant ?? "Standard"}
        </Text>
        <Text style={styles.price}>{(item.price * item.quantity).toFixed(2)} €</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => handleIncrease(item)} style={styles.qtyBtn}>
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.qtyLabel}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => handleDecrease(item)} style={styles.qtyBtn}>
          <Text style={styles.qtyText}>−</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeBtn}>
          <Text style={styles.removeText}>Suppr</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id + (i.variant ?? "")}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Votre panier est vide.</Text>}
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : undefined}
      />

      <View style={styles.footer}>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>{totalItems} articles</Text>
          <Text style={styles.summaryTextBold}>{totalPrice.toFixed(2)} €</Text>
        </View>

        <MainButton title={"Valider la commande"} onPress={handleCheckout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  item: { flexDirection: "row", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#eee" },
  name: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 12, color: "#666", marginTop: 4 },
  price: { marginTop: 6, fontSize: 14, color: "#222" },
  controls: { alignItems: "center", justifyContent: "center" },
  qtyBtn: { padding: 6 },
  qtyText: { fontSize: 18 },
  qtyLabel: { paddingHorizontal: 6, fontSize: 16 },
  removeBtn: { marginTop: 8 },
  removeText: { color: "#ff3b30" },
  footer: { paddingVertical: 12, borderTopWidth: 1, borderColor: "#eee", backgroundColor: "#fff" },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  summaryText: { fontSize: 14, color: "#666" },
  summaryTextBold: { fontSize: 16, fontWeight: "700" },
  empty: { textAlign: "center", color: "#666" },
  emptyContainer: { flex: 1, justifyContent: "center" },
});
