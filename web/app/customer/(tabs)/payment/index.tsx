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

// Types pour les données de brasserie
interface BreweryHours {
  [key: string]: {
    open: string;
    close: string;
    closed?: boolean;
  };
}

interface Brewery {
  id: string;
  name: string;
  address: string;
  hours: BreweryHours;
  preparationTime: number; // en minutes
}

// Méthodes de paiement disponibles
const PAYMENT_METHODS = [
  {
    id: "card",
    name: "Carte bancaire",
    icon: "💳",
    description: "Visa, Mastercard, American Express",
  },
  {
    id: "apple_pay",
    name: "Apple Pay",
    icon: "📱",
    description: "Paiement rapide et sécurisé",
  },
  {
    id: "google_pay",
    name: "Google Pay",
    icon: "🤖",
    description: "Paiement avec Google",
  },
  {
    id: "cash",
    name: "Espèces",
    icon: "💵",
    description: "Paiement à la récupération",
  },
];

const CheckoutConfirmationScreen = () => {
  const { items, totalPrice, totalItems } = useCart();
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [brewery, setBrewery] = useState<Brewery | null>(null);

  // Données d'exemple pour la brasserie (remplacez par votre API)
  const mockBrewery: Brewery = {
    id: "1",
    name: "Brasserie Artisanale",
    address: "123 Rue de la Bière, 75001 Paris",
    hours: {
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "20:00" },
      saturday: { open: "10:00", close: "20:00" },
      sunday: {
        closed: true,
        open: "",
        close: "",
      },
    },
    preparationTime: 30,
  };

  useEffect(() => {
    // Ici vous chargeriez les données de la brasserie depuis votre API
    // En utilisant l'ID de la brasserie des articles du panier
    const breweryId = items[0]?.breweryId;
    if (breweryId) {
      // Simuler un appel API
      setBrewery(mockBrewery);
    }
  }, [items]);

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

    // Ajouter le temps de préparation à l'heure actuelle si c'est aujourd'hui
    const minTime = isToday
      ? new Date(now.getTime() + brewery.preparationTime * 60000)
      : new Date(openTime);

    // Générer les créneaux de 30 minutes
    const current = new Date(Math.max(openTime.getTime(), minTime.getTime()));
    current.setMinutes(Math.ceil(current.getMinutes() / 30) * 30);

    while (current < closeTime) {
      times.push(current.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
      current.setMinutes(current.getMinutes() + 30);
    }

    return times;
  };

  const handleDateSelection = (date: Date, label: string) => {
    setSelectedDate(label);
    const times = getAvailableTimesForDate(date);
    setAvailableTimes(times);
    setSelectedTime(times[0] || ""); // Sélectionner automatiquement la première heure disponible
    setShowDatePicker(false);
  };

  const handleConfirmOrder = () => {
    if (!selectedPayment) {
      Alert.alert("Erreur", "Veuillez sélectionner un mode de paiement");
      return;
    }

    if (!selectedDate || !selectedTime) {
      Alert.alert("Erreur", "Veuillez sélectionner une date et heure de récupération");
      return;
    }

    Alert.alert(
      "Confirmer la commande",
      `Commande de ${totalItems} article(s) pour ${totalPrice.toFixed(2)}€\n\nRécupération : ${selectedDate} à ${selectedTime}\nPaiement : ${PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.name}`,
      [
        { text: "Modifier", style: "cancel" },
        {
          text: "Confirmer",
          onPress: () => {
            // Ici vous traiterez la commande
            console.log("Commande confirmée");
            // Navigation vers l'écran de paiement ou confirmation finale
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
            title={`${selectedDate} || "Sélectionner une date"`}
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

        {/* Mode de paiement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Mode de paiement</Text>

          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPayment === method.id && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentMethodContent}>
                <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
                <View style={styles.paymentMethodInfo}>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                  <Text style={styles.paymentMethodDescription}>{method.description}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedPayment === method.id && styles.radioButtonSelected,
                ]}
              >
                {selectedPayment === method.id && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}
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
            (!selectedPayment || !selectedDate || !selectedTime) && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmOrder}
          disabled={!selectedPayment || !selectedDate || !selectedTime}
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
