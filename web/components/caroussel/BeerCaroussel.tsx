import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
import BeerCard from "../beerCard/BeerCard";

interface BeerCarousselProps {
  beers: {
    title: string;
    style: string;
    color: string;
    abv: string;
    price: string;
    stock: number;
    description: string;
    image: string;
  }[];
}

export default function BeerCaroussel({ beers }: BeerCarousselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % beers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + beers.length) % beers.length);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePrev} style={styles.button}>
        <Text style={styles.buttonText}>Previous</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {beers.map((beer, index) => (
          <View key={index} style={styles.cardContainer}>
            {index === currentIndex && (
              <BeerCard
                title={beer.title}
                style={beer.style}
                color={beer.color}
                abv={beer.abv}
                price={beer.price}
                stock={beer.stock}
                description={beer.description}
                image={beer.image}
              />
            )}
          </View>
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
