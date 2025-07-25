import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
import BeerCard, { BeerCardProps } from "../beerCard/BeerCard";
import { RelativePathString, useRouter } from "expo-router";

interface BeerCarousselProps {
  beers: BeerCardProps[];
}

export default function BeerCaroussel({ beers }: BeerCarousselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % beers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + beers.length) % beers.length);
  };

  const onPress = (beer: BeerCardProps) => {
    router.push({
      pathname: "/BeerDetails/[id]" as RelativePathString,
      params: { ...beer, id: beer.id },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePrev} style={styles.button}>
        <Text style={styles.buttonText}>Previous</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {beers.map((beer, index) => (
          <TouchableOpacity
            key={beer.id}
            onPress={() => onPress(beer)}
            style={styles.cardContainer}
          >
            {index === currentIndex && <BeerCard {...beer} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
  },
  cardContainer: {
    width: 336, // Match the width of BeerCard
  },
});
