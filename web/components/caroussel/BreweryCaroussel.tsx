import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
import BreweryCardSmall from "../brewery/BreweryCardSmall";

interface BreweryCarousselProps {
  breweries: { image: string; title: string }[];
}

const BreweryCaroussel: React.FC<BreweryCarousselProps> = ({ breweries }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % breweries.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + breweries.length) % breweries.length);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePrev} style={styles.button}>
        <Text style={styles.buttonText}>Previous</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {breweries.map((brewery, index) => (
          <TouchableOpacity key={index} style={styles.cardContainer}>
            {index === currentIndex && (
              <BreweryCardSmall image={brewery.image} title={brewery.title} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    marginHorizontal: 5,
  },
});

export default BreweryCaroussel;
