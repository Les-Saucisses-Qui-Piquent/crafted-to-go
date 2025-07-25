// app/BeerDetails/[id].tsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import BeerDetails from "../BeerDetails";

export default function BeerDetailsPage() {
  const params = useLocalSearchParams();

  const beer = {
    id: params.id as string,
    title: params.title as string,
    style: params.style as string,
    color: params.color as string,
    abv: params.abv as string,
    price: Number(params.price),
    stock: Number(params.stock),
    description: params.description as string,
    image: params.image as string,
    breweryId: params.breweryId as string,
    breweryName: params.breweryName as string,
  };

  return <BeerDetails {...beer} />;
}
