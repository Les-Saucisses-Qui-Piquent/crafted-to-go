import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import BeerCardLarge from "../beerCard/beerCardLarge";
import { BeerCardProps } from "../beerCard/BeerCard";
import { RelativePathString, useRouter } from "expo-router";

interface LargeBeerCarousselProps {
  beers: BeerCardProps[];
}

const LargeBeerCaroussel: React.FC<LargeBeerCarousselProps> = ({ beers }) => {
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
        {beers.map((beer) => (
          <TouchableOpacity
            key={beer.id}
            style={styles.cardContainer}
            onPress={() => onPress(beer)}
          >
            <BeerCardLarge beer={beer} />
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

export default LargeBeerCaroussel;
