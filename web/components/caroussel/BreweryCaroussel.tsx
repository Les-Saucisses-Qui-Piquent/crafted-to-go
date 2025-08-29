import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
import BreweryCardSmall, { BreweryProps } from "../brewery/BreweryCardSmall";
import { useRouter } from "expo-router";

interface BreweryCarousselProps {
  breweries: BreweryProps[];
}

const BreweryCaroussel = ({ breweries }: BreweryCarousselProps) => {
  const router = useRouter();

  const handleNavigate = (brewery: BreweryProps) => {
    router.push(`/customer/BreweryDetails/${brewery.id}`);
  };

  if (!breweries || breweries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text>Aucune brasserie trouvée</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {breweries.map((brewery) => (
          <TouchableOpacity
            key={brewery.id}
            style={styles.cardWrapper}
            activeOpacity={0.8}
            onPress={() => handleNavigate(brewery)}
          >
            <BreweryCardSmall {...brewery} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: "flex-start",
  },
  cardWrapper: {
    marginRight: 15,
    // force une largeur fixe pour éviter chevauchement
    width: 250,
  },
  empty: {
    padding: 12,
  },
});

export default BreweryCaroussel;
