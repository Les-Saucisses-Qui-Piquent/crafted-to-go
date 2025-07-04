import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useCart, CartItem } from "@/contexts/CartContext";
import MainButton from "@/components/Buttons/MainButton";

const BasketScreen = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        "Supprimer l'article",
        "Êtes-vous sûr de vouloir supprimer cet article du panier ?",
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: () => removeItem(id),
          },
        ],
      );
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleClearCart = () => {
    Alert.alert("Vider le panier", "Êtes-vous sûr de vouloir vider tout le panier ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Vider",
        style: "destructive",
        onPress: clearCart,
      },
    ]);
  };

  const handleCheckout = () => {
    // Ici vous pouvez ajouter votre logique de checkout
    Alert.alert("Commande", "Procéder à la commande ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Continuer",
        onPress: () => {
          // envoyer vers index de payment
          console.log("Naviguer vers checkout");
        },
      },
    ]);
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} €`;
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🍺</Text>
          </View>
        )}
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.breweryName}>{item.breweryName}</Text>
        {item.variant && <Text style={styles.itemVariant}>{item.variant}</Text>}
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <MainButton onPress={() => handleQuantityChange(item.id, item.quantity - 1)} title={"-"} />

        <Text style={styles.quantityText}>{item.quantity}</Text>

        <MainButton onPress={() => handleQuantityChange(item.id, item.quantity + 1)} title={"+"} />
      </View>

      <MainButton onPress={() => removeItem(item.id)} title={"x"} />
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Text style={styles.emptyCartIcon}>🛒</Text>
      <Text style={styles.emptyCartTitle}>Votre panier est vide</Text>
      <Text style={styles.emptyCartSubtitle}>Ajoutez des articles pour commencer</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Panier</Text>
        {items.length > 0 && <MainButton title="Vider" onPress={handleClearCart} />}
      </View>

      {/* Cart Items */}
      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => `${item.id}-${item.variant || "default"}`}
            style={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Articles ({totalItems})</Text>
              <Text style={styles.summaryValue}>{formatPrice(totalPrice)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Livraison</Text>
              <Text style={styles.summaryValue}>Gratuite</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
            </View>
          </View>

          {/* Checkout Button */}
          <MainButton onPress={handleCheckout} title={`Commander • ${formatPrice(totalPrice)}`} />
        </>
      ) : (
        renderEmptyCart()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
  },
  clearButton: {
    color: "#dc3545",
    fontSize: 16,
    fontWeight: "600",
  },
  cartList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
  },
  itemDetails: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  breweryName: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 2,
  },
  itemVariant: {
    fontSize: 12,
    color: "#868e96",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#28a745",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginRight: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9ecef",
    borderRadius: 6,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#495057",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: "center",
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dc3545",
    borderRadius: 16,
  },
  removeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  summary: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#6c757d",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
  },
  divider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
  },
  checkoutButton: {
    backgroundColor: "#007bff",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyCartIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
});

export default BasketScreen;
