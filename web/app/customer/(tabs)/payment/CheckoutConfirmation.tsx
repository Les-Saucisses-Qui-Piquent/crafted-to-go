import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
} from "react-native";
import { useCart } from "@/contexts/CartContext";
import SelectInput from "@/components/form/SelectInput";
import MainButton from "@/components/Buttons/MainButton";
import { RelativePathString, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useClientData } from "@/contexts/CostumerDataProvider";
import { BeerCardProps } from "@/components/beerCard/BeerCard";
import { BreweryProps } from "@/components/brewery/BreweryCardSmall";

const CheckoutConfirmationScreen = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user, token } = useAuth();
  const { getBreweryById, getBeerById, getBreweryIdByBeerId } = useClientData();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [brewery, setBrewery] = useState<BreweryProps | null>(null);
  const [beersDetails, setBeersDetails] = useState<BeerCardProps[]>([]);
  const router = useRouter();

  const API_BASE = process.env.EXPO_PUBLIC_API_URL as string;
  useEffect(() => {
    if (!items || items.length === 0) {
      setBrewery(null);
      setBeersDetails([]);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const firstBeerId = items[0]?.id;
        const breweryIdFromBeer = firstBeerId ? await getBreweryIdByBeerId(firstBeerId) : undefined;
        const breweryId = breweryIdFromBeer || items[0]?.breweryId;

        if (!breweryId) {
          if (mounted) setBrewery(null);
        } else {
          const b = await getBreweryById(breweryId);
          if (mounted) {
            if (b) {
              setBrewery({
                id: b.id,
                name: b.name,
                address: b.address,
                hours: b.opening_hours,
              });
            } else {
              setBrewery(null);
            }
          }
        }

        // charger les détails des bières pour affichage / validation
        const details = await Promise.all(
          items.map(async (it) => {
            try {
              const beer = await getBeerById(it.id);
              return beer || { id: it.id, name: it.name, price: it.price };
            } catch {
              return { id: it.id, name: it.name, price: it.price };
            }
          }),
        );
        if (mounted) setBeersDetails(details);
      } catch (err) {
        console.error("Erreur lecture brasserie/bières :", err);
        if (mounted) {
          setBrewery(null);
          setBeersDetails(items.map((it) => ({ id: it.id, name: it.name, price: it.price })));
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [items, getBreweryById, getBeerById, getBreweryIdByBeerId]);

  const getDayName = (date: Date): string => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[date.getDay()];
  };

  const getAvailableDates = (): Array<{ date: Date; label: string }> => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayName = getDayName(date);
      const dayHours = brewery?.hours[dayName];

      if (dayHours && !dayHours.closed) {
        const label =
          i === 0
            ? "Aujourd'hui"
            : i === 1
              ? "Demain"
              : date.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                });

        dates.push({ date, label });
      }
    }

    return dates;
  };

  const getAvailableTimesForDate = (date: Date): string[] => {
    if (!brewery) return [];

    const dayName = getDayName(date);
    const dayHours = brewery.hours[dayName];

    if (!dayHours || dayHours.closed) return [];

    const times = [];
    const openTime = new Date(`2000-01-01T${dayHours.open}:00`);
    const closeTime = new Date(`2000-01-01T${dayHours.close}:00`);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const minTime = isToday
      ? new Date(now.getTime() + brewery.preparationTime * 60000)
      : new Date(openTime);

    const current = new Date(Math.max(openTime.getTime(), minTime.getTime()));
    current.setMinutes(Math.ceil(current.getMinutes() / 30) * 30);

    while (current < closeTime) {
      times.push(current.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
      current.setMinutes(current.getMinutes() + 30);
    }

    return times;
  };

  const handleDateSelection = (date: Date, label: string) => {
    setSelectedDate(date.toISOString().slice(0, 10));
    setSelectedDateLabel(label);
    const times = getAvailableTimesForDate(date);
    setAvailableTimes(times);
    setSelectedTime(times[0] || "");
    setShowDatePicker(false);
  };

  const handleConfirmOrder = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Erreur", "Veuillez sélectionner une date et heure de récupération");
      return;
    }

    Alert.alert(
      "Confirmer la commande",
      `Commande de ${totalItems} article(s) pour ${totalPrice.toFixed(2)}€\n\nRécupération : ${selectedDateLabel || selectedDate} à ${selectedTime}\nPaiement : À la récupération (sur place)`,
      [
        { text: "Modifier", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            try {
              if (!items || items.length === 0) {
                Alert.alert("Panier vide", "Votre panier est vide.");
                return;
              }

              // déterminer la brasserie à partir du premier beer_id si possible
              const firstBeerId = items[0]?.id;
              const breweryIdFromBeer = firstBeerId
                ? await getBreweryIdByBeerId(firstBeerId)
                : undefined;
              const breweryIdFromItem = items[0]?.breweryId;
              const resolvedBreweryId = brewery?.id || breweryIdFromBeer || breweryIdFromItem;

              console.log("resolved brewery id:", resolvedBreweryId);
              if (!resolvedBreweryId) {
                Alert.alert("Erreur", "Brasserie introuvable pour la commande.");
                return;
              }

              const payload: any = {
                user_id: user?.id || null,
                brewery_id: brewery?.id || resolvedBreweryId,
                final_price: Number(totalPrice.toFixed(2)),
                pickup_day: selectedDate,
                pickup_time: selectedTime,
                payment_method: "cash",
                status: "new",
                details: items.map((it, idx) => {
                  // preferer l'id de la bière telle que fournie (it.id). si getBeerById renvoie autre id, replace si besoin.
                  const beerDetail = beersDetails[idx];
                  return {
                    beer_id: beerDetail?.id || it.id,
                    quantity: it.quantity,
                    price: Number(it.price.toFixed(2)),
                  };
                }),
              };

              const headers: Record<string, string> = { "Content-Type": "application/json" };
              if (token) headers["Authorization"] = `Bearer ${token}`;

              const res = await fetch(`${API_BASE.replace(/\/$/, "")}/orders`, {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
              });

              if (!res.ok) {
                const text = await res.text().catch(() => "");
                console.error("Order creation failed:", res.status, text);
                throw new Error("Erreur création commande");
              }

              const json = await res.json();
              const orderId = json.id || json.order?.id;
              if (!orderId) {
                console.warn("Réponse API ne contient pas d'id:", json);
              }

              clearCart();

              router.push({
                pathname: "customer/OrderDetails" as unknown as RelativePathString,
                params: { orderId },
              });
            } catch (error) {
              console.error("create order error", error);
              Alert.alert("Erreur", "Impossible de créer la commande. Réessayez.");
            }
          },
        },
      ],
    );
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} €`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Confirmation de commande</Text>
          <Text style={styles.headerSubtitle}>
            {totalItems} article(s) • {formatPrice(totalPrice)}
          </Text>
        </View>

        {/* Récupération */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Lieu de récupération</Text>
          {brewery && (
            <View style={styles.breweryInfo}>
              <Text style={styles.breweryName}>{brewery.name}</Text>
              <Text style={styles.breweryAddress}>{brewery.address}</Text>
            </View>
          )}
        </View>

        {/* Date et heure */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Date et heure de récupération</Text>

          <MainButton
            title={selectedDateLabel || "Sélectionner une date"}
            onPress={() => setShowDatePicker(true)}
          />

          {selectedDate && availableTimes.length > 0 && (
            <View style={styles.timePickerContainer}>
              <SelectInput
                label="Heure de récupération"
                items={availableTimes.map((time) => ({ label: time, value: time }))}
                onValueChange={(value) => setSelectedTime(value)}
                selectedValue={selectedTime}
                width={300}
              />
            </View>
          )}

          {brewery && (
            <Text style={styles.preparationNote}>
              ⏱️ Temps de préparation : {brewery.preparationTime} minutes
            </Text>
          )}
        </View>

        {/* Paiement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Paiement</Text>
          <View style={{ padding: 8 }}>
            <Text>
              Le paiement se fera uniquement sur place lors de la récupération de la commande.
            </Text>
          </View>
        </View>

        {/* Résumé */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Résumé</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={styles.summaryValue}>{formatPrice(totalPrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frais de service</Text>
            <Text style={styles.summaryValue}>Gratuit</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bouton de confirmation */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedDate || !selectedTime) && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmOrder}
          disabled={!selectedDate || !selectedTime}
        >
          <Text style={styles.confirmButtonText}>
            Confirmer la commande • {formatPrice(totalPrice)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de sélection de date */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionner une date</Text>
            {getAvailableDates().map((dateItem, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dateOption}
                onPress={() => handleDateSelection(dateItem.date, dateItem.label)}
              >
                <Text style={styles.dateOptionText}>{dateItem.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.modalCloseText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6c757d",
  },
  section: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 16,
  },
  breweryInfo: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
  },
  breweryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  breweryAddress: {
    fontSize: 14,
    color: "#6c757d",
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#212529",
  },
  dateButtonIcon: {
    fontSize: 20,
  },
  preparationNote: {
    fontSize: 14,
    color: "#6c757d",
    fontStyle: "italic",
    marginTop: 12,
  },
  timePickerContainer: {
    marginTop: 12,
  },
  paymentMethod: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  paymentMethodSelected: {
    borderColor: "#007bff",
    backgroundColor: "#e7f3ff",
  },
  paymentMethodContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 2,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: "#6c757d",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#dee2e6",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#007bff",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
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
  bottomContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  confirmButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#6c757d",
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 20,
    textAlign: "center",
  },
  dateOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  dateOptionText: {
    fontSize: 16,
    color: "#212529",
  },
  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  timeOptionText: {
    fontSize: 16,
    color: "#212529",
    textAlign: "center",
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#dc3545",
    fontWeight: "600",
  },
});

export default CheckoutConfirmationScreen;
