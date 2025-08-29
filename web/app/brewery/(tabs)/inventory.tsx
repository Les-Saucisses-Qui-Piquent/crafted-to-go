import React, { useState } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useBreweryData } from "@/contexts/BreweryDataContext";
import FilterPillar from "@/components/filterBars/FilterUnderline";
import SecondaryCTA from "@/components/Buttons/SecondaryCTA";
import { useRouter } from "expo-router";
import BeerCardHorizontal from "@/components/beerCard/BeerCardHorizontal";
import BeerCardActionsMenu from "@/components/BeerCardActionMenu";
import { BeerCardProps } from "@/components/beerCard/BeerCard";

const filters = [
  { label: "En ligne", key: "online" },
  { label: "Stock dispo", key: "stock" },
  { label: "Style", key: "style" },
  { label: "Couleur", key: "color" },
];

export default function Inventory() {
  const { beers, loading } = useBreweryData();
  const [selectedFilter, setSelectedFilter] = useState(0);

  // Menu d'actions
  const [actionsVisible, setActionsVisible] = useState(false);
  const [selectedBeer, setSelectedBeer] = useState<BeerCardProps>();
  const router = useRouter();

  const filteredBeers = beers.filter((beer) => {
    const filterKey = filters[selectedFilter].key;
    switch (filterKey) {
      case "online":
        return beer.quantity && beer.quantity > 0;
      case "stock":
        return beer.quantity && beer.quantity > 0;
      case "style":
        return beer.beer_style;
      case "color":
        return beer.color?.toLowerCase().includes("blonde");
      default:
        return true;
    }
  });

  // Handlers pour le menu d'actions
  const handleEdit = () => {
    setActionsVisible(false);
    if (selectedBeer) router.push(`/BeerEdit/${selectedBeer.id}`);
  };
  const handleEditStock = () => {
    setActionsVisible(false);
    if (selectedBeer) router.push(`/BeerStock/${selectedBeer.id}`);
  };
  const handleDelete = () => {
    setActionsVisible(false);
    if (selectedBeer) {
      // Ajoute ici ta logique de suppression (pop-up, api, etc)
      alert(`Supprimer la bière : ${selectedBeer.name}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <FilterPillar
            filters={filters.map((f) => f.label)}
            selectedIndex={selectedFilter}
            onSelect={setSelectedFilter}
          />
        </View>
        <SecondaryCTA
          title="Ajouter une bière"
          style={styles.addBtn}
          onPress={() => router.push("/BeerCreation")}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#A09C9C" />
      ) : (
        <ScrollView contentContainerStyle={styles.beerList}>
          {filteredBeers.map((beer) => (
            <BeerCardHorizontal
              beer={beer}
              key={beer.id}
              onMenuPress={() => {
                setSelectedBeer(beer);
                setActionsVisible(true);
              }}
            />
          ))}
        </ScrollView>
      )}

      {/* Menu d'actions global */}
      <BeerCardActionsMenu
        visible={actionsVisible}
        onClose={() => setActionsVisible(false)}
        onEdit={handleEdit}
        onEditStock={handleEditStock}
        onDelete={handleDelete}
      />
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
});
