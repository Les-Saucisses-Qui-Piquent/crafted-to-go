import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { useNotifications } from "@/contexts/NotificationContext";
import AppIcon from "@/utils/AppIcon";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  breweryId: string;
  breweryName: string;
  image?: string;
  variant?: string;
}

const CartScreen: React.FC = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  const { addOrder } = useOrders();
  const { addNotification } = useNotifications();

  const handleQuantityChange = (id: string, delta: number) => {
    const currentItem = items.find((item) => item.id === id);
    if (currentItem) {
      const newQuantity = currentItem.quantity + delta;
      if (newQuantity > 0) {
        updateQuantity(id, newQuantity);
      } else {
        removeItem(id);
      }
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    Alert.alert("Supprimer l'article", `Voulez-vous retirer "${name}" du panier ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", onPress: () => removeItem(id) },
    ]);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert("Panier vide", "Ajoutez des articles avant de commander");
      return;
    }

    Alert.alert(
      "Confirmer la commande",
      `Total: ${totalPrice.toFixed(2)}€\nConfirmer la commande de ${totalItems} article${totalItems > 1 ? "s" : ""} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Commander",
          onPress: () => {
            // Créer la commande
            addOrder({
              customerId: "current-user-id", // À remplacer par l'ID utilisateur réel
              customerName: "Client", // À remplacer par le nom utilisateur réel
              items: [...items],
              totalPrice,
              status: "pending",
              notes: "",
            });

            // Ajouter une notification
            addNotification({
              title: "Commande passée",
              body: `Votre commande de ${totalPrice.toFixed(2)}€ a été envoyée`,
              type: "order",
            });

            // Vider le panier
            clearCart();

            Alert.alert("Succès", "Votre commande a été passée avec succès !");
          },
        },
      ],
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image
        source={{
          uri: item.image || "https://dummyimage.com/60x60/DDD/999.png",
        }}
        style={styles.itemImage}
      />

      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemBrewery}>{item.breweryName}</Text>
        {item.variant && <Text style={styles.itemVariant}>{item.variant}</Text>}
        <Text style={styles.itemPrice}>{item.price.toFixed(2)}€</Text>
      </View>

      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.id, -1)}
        >
          <AppIcon name="remove" size={20} color="#666" />
        </TouchableOpacity>

        <Text style={styles.quantity}>{item.quantity}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.id, 1)}
        >
          <AppIcon name="add" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id, item.name)}
      >
        <AppIcon name="trash-outline" size={20} color="#FF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Panier</Text>
        <Text style={styles.itemCount}>
          {totalItems} article{totalItems !== 1 ? "s" : ""}
        </Text>
      </View>

      {items.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            Alert.alert("Vider le panier", "Êtes-vous sûr de vouloir vider le panier ?", [
              { text: "Annuler", style: "cancel" },
              { text: "Vider", onPress: clearCart },
            ]);
          }}
        >
          <Text style={styles.clearButtonText}>Vider le panier</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => `${item.id}-${item.variant || ""}`}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppIcon name="cart-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>Votre panier est vide</Text>
            <Text style={styles.emptySubtext}>Ajoutez des articles pour commencer</Text>
          </View>
        }
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{totalPrice.toFixed(2)}€</Text>
          </View>

          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Commander ({totalItems})</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#FFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  itemCount: {
    fontSize: 16,
    color: "#666",
  },
  clearButton: {
    backgroundColor: "#FFF",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  clearButtonText: {
    color: "#FF4444",
    fontSize: 16,
    fontWeight: "500",
  },
  list: {
    flex: 1,
  },
  cartItem: {
    backgroundColor: "#FFF",
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemBrewery: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  itemVariant: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 16,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#CCC",
    marginTop: 8,
  },
  footer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  checkoutButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default CartScreen;
