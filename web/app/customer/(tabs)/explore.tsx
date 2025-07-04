import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from "react-native";
import BeerCardLarge from "@/components/beerCard/beerCardLarge";
import FilterPillar from "@/components/filterBars/FilterUnderline";

const { width } = Dimensions.get("window");
const isTabletDevice = () => width >= 600;

// Interface pour une bière
interface Beer {
  id: number | string;
  imgPath: string;
  name: string;
  description: string;
  style: string;
  color: string;
  abv: string;
  price: string;
  stock: string | number;
  category: string;
}

// Props du composant ExploreScreen
interface ExploreScreenProps {
  beers: Beer[];
  filterCategories?: string[];
  title?: string;
  subtitle?: string;
}

export default function Explore({
  beers,
  filterCategories = ["Toutes"],
  title = "Explorer",
  subtitle = "Découvrez notre sélection de bières artisanales",
}: ExploreScreenProps) {
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
  const isTablet = isTabletDevice();

  // Filtrage des bières selon la catégorie sélectionnée
  const filteredBeers = useMemo(() => {
    if (selectedFilterIndex === 0) return beers;
    const selectedCategory = filterCategories[selectedFilterIndex];
    return beers.filter((beer) => beer.category === selectedCategory);
  }, [selectedFilterIndex, beers, filterCategories]);

  const styles = isTablet ? tabletStyles : mobileStyles;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <FilterPillar
        filters={filterCategories}
        selectedIndex={selectedFilterIndex}
        onSelect={setSelectedFilterIndex}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.beerList}>
          {filteredBeers.map((beer) => (
            <View key={beer.id} style={styles.beerCardContainer}>
              <BeerCardLarge
                imgPath={beer.imgPath}
                name={beer.name}
                description={beer.description}
                style={beer.style}
                color={beer.color}
                abv={beer.abv}
                price={beer.price}
                stock={beer.stock}
                isTablet={isTablet}
              />
            </View>
          ))}
        </View>

        {filteredBeers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Aucune bière trouvée pour cette catégorie</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: "#1D1D1B",
    fontFamily: "Hanken Grotesk",
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -1.08,
    lineHeight: 40,
    marginBottom: 4,
  },
  subtitle: {
    color: "#636360",
    fontFamily: "Hanken Grotesk",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  beerList: {
    paddingHorizontal: 16,
  },
  beerCardContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    color: "#636360",
    fontFamily: "Hanken Grotesk",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
});

const tabletStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    color: "#1D1D1B",
    fontFamily: "Hanken Grotesk",
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: -1.26,
    lineHeight: 48,
    marginBottom: 6,
  },
  subtitle: {
    color: "#636360",
    fontFamily: "Hanken Grotesk",
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  beerList: {
    paddingHorizontal: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  beerCardContainer: {
    marginBottom: 32,
    width: "48%",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyStateText: {
    color: "#636360",
    fontFamily: "Hanken Grotesk",
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
  },
});
