import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import BeerCardSmall from "../beerCard/BeerCardSmall";

interface SmallBeerCarousselProps {
  beers: {
    title: string;
    image: string;
    style?: string;
    abv?: string;
    price?: string;
    stock?: number;
  }[];
}

const SmallBeerCaroussel: React.FC<SmallBeerCarousselProps> = ({ beers }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {beers.map((beer, index) => (
          <TouchableOpacity>
            <BeerCardSmall
              key={index}
              title={beer.title}
              image={beer.image}
              style={beer.style}
              abv={beer.abv}
              price={beer.price}
              stock={beer.stock}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
});

export default SmallBeerCaroussel;
