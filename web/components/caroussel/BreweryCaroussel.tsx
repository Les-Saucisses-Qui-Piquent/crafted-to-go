import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
import BreweryCardSmall, { BreweryProps } from "../brewery/BreweryCardSmall";
import { RelativePathString, useRouter } from "expo-router";

interface BreweryCarousselProps {
  breweries: BreweryProps[];
}
const BreweryCaroussel = ({ breweries }: BreweryCarousselProps) => {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % breweries.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + breweries.length) % breweries.length);
  };

  const handleNavigate = (brewery: BreweryProps) => {
    router.push({
      pathname: "/BreweryDetails/[id]" as RelativePathString,
      params: {
        id: brewery.id,
        brewery: JSON.stringify(brewery),
      },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePrev} style={styles.button}>
        <Text style={styles.buttonText}>Previous</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {breweries.map((brewery, index) => (
          <TouchableOpacity
            key={brewery.id}
            style={styles.cardContainer}
            onPress={() => handleNavigate(brewery)}
          >
            {index === currentIndex && <BreweryCardSmall {...brewery} />}
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
