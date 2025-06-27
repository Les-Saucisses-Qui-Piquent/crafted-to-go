import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import BeerCardSmall from "../beerCard/BeerCardSmall";

interface SmallBeerCarousselProps {
  beers: {
    title: string;
    imgPath: string;
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
          <BeerCardSmall
            key={index}
            title={beer.title}
            imgPath={beer.imgPath}
            style={beer.style}
            abv={beer.abv}
            price={beer.price}
            stock={beer.stock}
          />
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
