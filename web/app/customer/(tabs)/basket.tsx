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
  TouchableOpacity,
} from "react-native";
import { useCart, CartItem } from "@/contexts/CartContext";
import { useRouter, RelativePathString } from "expo-router";
import MainButton from "@/components/Buttons/MainButton";

const BasketScreen = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();

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
    console.log("🔴 Bouton vider cliqué");
    clearCart();
    console.log("✅ Panier vidé");
  };

  const handleCheckout = () => {
    router.push({
      pathname: "customer/payment/CheckoutConfirmation" as unknown as RelativePathString,
    });
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} €`;
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      {item.image && (
        <Image 
          source={{ uri: item.image }} 
          style={styles.itemImage} 
          resizeMode="cover"
        />
      )}
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.breweryName}>{item.breweryName}</Text>
        
        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>PRIX:</Text>
            <Text style={styles.detailValue}>{formatPrice(item.price)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>QTÉ:</Text>
            <Text style={styles.detailValue}>{item.quantity}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>TOTAL:</Text>
            <Text style={styles.detailValue}>{formatPrice(item.price * item.quantity)}</Text>
          </View>
        </View>
        
      </View>
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
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Vider</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Items */}
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={(item) => `${item.id}-${item.variant || "default"}`}
          style={styles.cartList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
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

              {/* Checkout Button */}
              <TouchableOpacity onPress={handleCheckout} style={styles.customCheckoutButton}>
                <Text style={styles.customCheckoutButtonText}>
                  COMMANDER
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#dc3545",
    borderRadius: 6,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "HankenGrotesk",
  },
  cartList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "HankenGrotesk",
    color: "#000",
    marginBottom: 4,
  },
  breweryName: {
    fontSize: 14,
    fontFamily: "HankenGrotesk",
    color: "#666",
    marginBottom: 8,
  },
  itemDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "HankenGrotesk",
    fontWeight: "300",
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "HankenGrotesk",
    fontWeight: "600",
    color: "#000",
    flex: 1,
    textAlign: "right",
    textTransform: "uppercase",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityControls: {
    flexDirection: "row",
    gap: 8,
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
    marginTop: 10,
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
  customCheckoutButton: {
    backgroundColor: "#000",
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: "center",
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  customCheckoutButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    fontFamily: "HankenGrotesk",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
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
