import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Dimensions, Button } from "react-native";
import BeerCardLarge from "../beerCard/beerCardLarge";
import { BeerCardProps } from "../beerCard/BeerCard";

const { width } = Dimensions.get("window");

interface LargeBeerCarousselProps {
  beers: BeerCardProps[];
}

const LargeBeerCaroussel: React.FC<LargeBeerCarousselProps> = ({ beers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < beers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const index = Math.floor(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      >
        {beers.map((beer, index) => (
          <View key={index} style={styles.cardContainer}>
            <BeerCardLarge {...beer} image={beer.image ?? ""} />
          </View>
        ))}
      </ScrollView>
      <View style={styles.navigation}>
        <Button title="Previous" onPress={handlePrev} disabled={currentIndex === 0} />
        <Button title="Next" onPress={handleNext} disabled={currentIndex === beers.length - 1} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    width: width,
    alignItems: "center",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
});

export default LargeBeerCaroussel;
