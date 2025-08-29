import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Text,
  Modal,
} from "react-native";
import { useBreweryData } from "@/contexts/BreweryDataContext";
import SecondaryCTA from "@/components/Buttons/SecondaryCTA";
import { useRouter } from "expo-router";
import BeerCardHorizontal from "@/components/beerCard/BeerCardHorizontal";
import { BeerCardProps } from "@/components/beerCard/BeerCard";
import { useApiClient } from "@/utils/api-client";
import ModalSmall from "@/components/modals/ModalSmall";

export default function Inventory() {
  const { beers, loading, refreshBeers } = useBreweryData();
  const router = useRouter();
  const { apiClient } = useApiClient();

  // Etat pour la modale de changement de stock
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockValue, setStockValue] = useState("");
  const [beerToEditStock, setBeerToEditStock] = useState<BeerCardProps | null>(null);

  // Handler pour éditer la bière (formulaire complet)
  const handleEdit = (beer: BeerCardProps) => {
    router.push({
      pathname: "./BeerFormScreen",
      params: { isEdit: "true", beerId: beer.id },
    });
  };

  // Handler pour ouvrir la modale de changement de stock
  const openStockModal = (beer: BeerCardProps) => {
    setBeerToEditStock(beer);
    setStockValue(String(beer.quantity ?? ""));
    setShowStockModal(true);
  };

  // Handler pour valider le changement de stock depuis la modale
  const confirmEditStock = async () => {
    const newStock = Number(stockValue);
    if (!Number.isFinite(newStock) || newStock < 0 || !beerToEditStock) {
      Alert.alert("Valeur invalide", "Entrez un nombre positif.");
      return;
    }
    setShowStockModal(false);
    try {
      await apiClient(`/beers/${beerToEditStock.id}`, {
        method: "PUT",
        body: JSON.stringify({ quantity: newStock }),
        headers: { "Content-Type": "application/json" },
      });
      Alert.alert("Stock mis à jour !");
      refreshBeers?.();
    } catch {
      Alert.alert("Erreur", "Impossible de mettre à jour le stock.");
    } finally {
      setBeerToEditStock(null);
    }
  };

  // Suppression de la bière
  const handleDelete = (beer: BeerCardProps) => {
    Alert.alert("Supprimer la bière", `Confirmer la suppression de "${beer.name}" ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient(`/beers/${beer.id}`, { method: "DELETE" });
            Alert.alert("Bière supprimée !");
            refreshBeers?.();
          } catch (e) {
            Alert.alert("Erreur", "Impossible de supprimer la bière.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <SecondaryCTA
          title="Ajouter une bière"
          style={styles.addBtn}
          onPress={() =>
            router.push({
              pathname: "./BeerFormScreen",
              params: { isEdit: "false" },
            })
          }
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#A09C9C" />
      ) : (
        <ScrollView contentContainerStyle={styles.beerList}>
          {beers.map((beer) => (
            <BeerCardHorizontal
              beer={beer}
              key={beer.id}
              onEdit={handleEdit}
              onEditStock={() => openStockModal(beer)}
              onDelete={() => handleDelete(beer)}
            />
          ))}
        </ScrollView>
      )}

      {/* Modale pour changement du stock */}
      <Modal visible={showStockModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ModalSmall onClose={() => setShowStockModal(false)}>
            <Text style={{ marginBottom: 8, fontWeight: "bold", fontSize: 16 }}>
              Changer le stock
            </Text>
            <Text style={{ fontSize: 13, marginBottom: 10 }}>
              Stock actuel: {beerToEditStock?.quantity}
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 6,
                marginVertical: 8,
                padding: 8,
                width: 100,
                textAlign: "center",
                fontSize: 15,
              }}
              keyboardType="numeric"
              value={stockValue}
              onChangeText={setStockValue}
              placeholder="Nouveau stock"
            />
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <SecondaryCTA
                title="Annuler"
                style={{ flex: 1 }}
                onPress={() => setShowStockModal(false)}
              />
              <SecondaryCTA title="Valider" style={{ flex: 1 }} onPress={confirmEditStock} />
            </View>
          </ModalSmall>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  addBtn: {
    marginLeft: 12,
    width: 128,
    height: 27,
  },
  beerList: {
    gap: 16,
    paddingBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
});
