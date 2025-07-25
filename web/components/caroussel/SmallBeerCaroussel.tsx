import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import BeerCardSmall from "../beerCard/BeerCardSmall";

interface SmallBeerCarousselProps {
  beers: {
    name: string;
    image?: string;
    beer_style?: string;
    abv_rate?: number;
    price?: number;
    quantity?: number;
  }[];
}

const SmallBeerCaroussel: React.FC<SmallBeerCarousselProps> = ({ beers }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {beers.map((beer, index) => (
          <TouchableOpacity key={index} style={styles.cardContainer}>
            <BeerCardSmall
              name={beer.name}
              image={beer.image}
              beer_style={beer.beer_style}
              abv_rate={beer.abv_rate}
              price={beer.price}
              quantity={beer.quantity}
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
  cardContainer: {
    marginRight: 15,
    marginLeft: 5,
  },
});

export default SmallBeerCaroussel;
