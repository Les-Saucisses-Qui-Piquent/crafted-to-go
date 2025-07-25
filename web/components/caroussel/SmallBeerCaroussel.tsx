import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import BeerCardSmall from "../beerCard/BeerCardSmall";
import { BeerCardProps } from "../beerCard/BeerCard";
import { RelativePathString, useRouter } from "expo-router";

interface SmallBeerCarousselProps {
  beers: BeerCardProps[];
}

const SmallBeerCaroussel = ({ beers }: SmallBeerCarousselProps) => {
  const router = useRouter();

  const onPress = (beer: BeerCardProps) => {
    router.push({
      pathname: "/BeerDetails/[id]" as RelativePathString,
      params: { 
        ...beer, 
        id: beer.id,
        beer_style: beer.beer_style?.label || ""
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {beers.map((beer, index) => (
          <TouchableOpacity onPress={() => onPress(beer)} key={beer.id} style={styles.cardContainer}>
            <BeerCardSmall beer={beer} />
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
  cardContainer: {
    marginRight: 15,
    marginLeft: 10,
  },
});

export default SmallBeerCaroussel;
