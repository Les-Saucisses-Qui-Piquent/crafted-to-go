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
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCart } from "@/contexts/CartContext";
import MainButton from "@/components/Buttons/MainButton";
import { RelativePathString, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useClientData } from "@/contexts/CostumerDataProvider";
import { BeerCardProps } from "@/components/beerCard/BeerCard";
import { OpeningHours, OpeningHoursDetail, Day } from "@/app/registerBrewery";
import { BreweryProps } from "@/components/brewery/BreweryCardSmall";

const CheckoutConfirmationScreen = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user, token } = useAuth();
  const { getBreweryById, getBeerById, getBreweryIdByBeerId } = useClientData();
  const [selectedDateISO, setSelectedDateISO] = useState<string>(""); // YYYY-MM-DD
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>(""); // "HH:MM"
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [brewery, setBrewery] = useState<BreweryProps | null>(null);
  const [beersDetails, setBeersDetails] = useState<BeerCardProps[]>([]);
  const router = useRouter();

  const API_BASE = (process.env.EXPO_PUBLIC_API_URL as string) || "http://localhost:3000";

  useEffect(() => {
    if (!items || items.length === 0) {
      setBrewery(null);
      setBeersDetails([]);
      return;
    }

    (async () => {
      try {
        const firstBeerId = items[0]?.id;
        const breweryIdFromBeer = firstBeerId ? await getBreweryIdByBeerId(firstBeerId) : undefined;
        const breweryId = breweryIdFromBeer || items[0]?.breweryId;

        if (breweryId) {
          const b = await getBreweryById(breweryId);
          setBrewery(b || null);
        } else {
          setBrewery(null);
        }

        const details = await Promise.all(
          items.map(async (it) => {
            try {
              const beer = await getBeerById(it.id);
              return beer || ({ id: it.id, name: it.name, price: it.price } as BeerCardProps);
            } catch {
              return { id: it.id, name: it.name, price: it.price } as BeerCardProps;
            }
          }),
        );
        setBeersDetails(details.filter(Boolean));
      } catch (err) {
        console.error("Erreur lecture brasserie/bières :", err);
        setBrewery(null);
        setBeersDetails([]);
      }
    })();
  }, [items, getBreweryById, getBeerById, getBreweryIdByBeerId]);

  const getDayName = (date: Date): Day => {
    const days: Day[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[date.getDay()];
  };

  const toISODate = (d: Date) => d.toISOString().slice(0, 10);

  const formatDateLabel = (d: Date) => {
    const delta = Math.floor((d.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
    if (delta === 0) return "Aujourd'hui";
    if (delta === 1) return "Demain";
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  };

  const parseHHMM = (s?: string) => {
    if (!s) return null;
    const [hh, mm] = s.split(":").map(Number);
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    return d;
  };

  const timeToString = (date: Date) =>
    date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const isTimeInRange = (timeStr: string, range: OpeningHoursDetail | undefined) => {
    if (!range || !range.isOpen || !range.openTime || !range.closeTime) return false;
    const t = parseHHMM(timeStr);
    const open = parseHHMM(range.openTime)!;
    const close = parseHHMM(range.closeTime)!;
    return t!.getTime() >= open.getTime() && t!.getTime() < close.getTime();
  };

  const onDateChange = (_: unknown, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (!date) return;
    setSelectedDateISO(toISODate(date));
    setSelectedDateLabel(formatDateLabel(new Date(date)));
    setSelectedTime("");
  };

  // Time picker change
  const onTimeChange = (_: unknown, date?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (!date) return;
    const timeStr = timeToString(date);
    // validate against brewery opening_hours for selectedDate
    if (!brewery) {
      setSelectedTime(timeStr);
      return;
    }
    const dayName = getDayName(new Date(selectedDateISO || new Date().toISOString().slice(0, 10)));
    const hoursForDay: OpeningHoursDetail | undefined = brewery.opening_hours
      ? (brewery.opening_hours as OpeningHours)[dayName]
      : undefined;
    if (!hoursForDay || !hoursForDay.isOpen) {
      Alert.alert(
        "Non disponible",
        "La brasserie est fermée ce jour-là. Choisissez une autre date.",
      );
      setSelectedTime("");
      return;
    }
    // check range
    if (!isTimeInRange(timeStr, hoursForDay)) {
      Alert.alert(
        "Heure non valide",
        `L'heure choisie doit être comprise entre ${hoursForDay.openTime} et ${hoursForDay.closeTime}`,
      );
      setSelectedTime("");
      return;
    }
    const selectedDateTime = new Date(date);

    setSelectedTime(timeToString(selectedDateTime));
  };

  const handleConfirmOrder = () => {
    if (!selectedDateISO || !selectedTime) {
      Alert.alert("Erreur", "Veuillez sélectionner une date et heure de récupération");
      return;
    }

    Alert.alert(
      "Confirmer la commande",
      `Commande de ${totalItems} article(s) pour ${totalPrice.toFixed(2)}€\n\nRécupération : ${selectedDateLabel || selectedDateISO} à ${selectedTime}\nPaiement : À la récupération (sur place)`,
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

              const firstBeerId = items[0]?.id;
              const breweryIdFromBeer = firstBeerId
                ? await getBreweryIdByBeerId(firstBeerId)
                : undefined;
              const breweryIdFromItem = items[0]?.breweryId;
              const resolvedBreweryId =
                brewery?.brewery_id || breweryIdFromBeer || breweryIdFromItem;

              if (!resolvedBreweryId) {
                Alert.alert("Erreur", "Brasserie introuvable pour la commande.");
                return;
              }

              const payload: unknown = {
                user_id: user?.id || null,
                brewery_id: resolvedBreweryId,
                final_price: Number(totalPrice.toFixed(2)),
                pickup_day: selectedDateISO,
                pickup_time: selectedTime,
                payment_method: "cash",
                status: "new",
                details: items.map((it, idx) => {
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

  const formatPrice = (price: number) => `${price.toFixed(2)} €`;

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
              <Text style={styles.breweryAddress}>
                {brewery.address
                  ? [
                      brewery.address.line_1,
                      brewery.address.line_2,
                      `${brewery.address.postal_code} ${brewery.address.city}`,
                      brewery.address.country,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : ""}
              </Text>
            </View>
          )}
        </View>

        {/* Date & Time selection using DateTimePicker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Date et heure de récupération</Text>

          <View style={{ marginBottom: 12 }}>
            <MainButton
              title={selectedDateLabel || "Sélectionner une date"}
              onPress={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
              <DateTimePicker
                value={selectedDateISO ? new Date(selectedDateISO) : new Date()}
                mode="date"
                display="calendar"
                minimumDate={new Date()}
                maximumDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
                onChange={onDateChange}
              />
            )}
          </View>

          <View style={{ marginBottom: 12 }}>
            <MainButton
              title={selectedTime || "Sélectionner une heure"}
              onPress={() => {
                if (!selectedDateISO) {
                  Alert.alert("Sélectionnez d'abord une date");
                  return;
                }
                setShowTimePicker(true);
              }}
            />
            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="spinner"
                is24Hour={true}
                onChange={onTimeChange}
              />
            )}
          </View>
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
            (!selectedDateISO || !selectedTime) && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmOrder}
          disabled={!selectedDateISO || !selectedTime}
        >
          <Text style={styles.confirmButtonText}>
            Confirmer la commande • {formatPrice(totalPrice)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollView: { flex: 1 },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#212529", marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: "#6c757d" },
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
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#212529", marginBottom: 16 },
  breweryInfo: { backgroundColor: "#f8f9fa", padding: 16, borderRadius: 8 },
  breweryName: { fontSize: 16, fontWeight: "600", color: "#212529", marginBottom: 4 },
  breweryAddress: { fontSize: 14, color: "#6c757d" },
  preparationNote: { fontSize: 14, color: "#6c757d", fontStyle: "italic", marginTop: 12 },
  timePickerContainer: { marginTop: 12 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 16, color: "#6c757d" },
  summaryValue: { fontSize: 16, fontWeight: "600", color: "#212529" },
  divider: { height: 1, backgroundColor: "#e9ecef", marginVertical: 8 },
  totalLabel: { fontSize: 18, fontWeight: "bold", color: "#212529" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#28a745" },
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
  confirmButtonDisabled: { backgroundColor: "#6c757d" },
  confirmButtonText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});

export default CheckoutConfirmationScreen;
