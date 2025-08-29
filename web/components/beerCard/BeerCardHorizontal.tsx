import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import AppIcon from "@/utils/AppIcon";
import { BeerCardProps } from "./BeerCard";
import BeerCardActionsMenu from "../BeerCardActionMenu";

interface BeerCardHorizontalProps {
  beer: BeerCardProps;
  onEdit?: (beer: BeerCardProps) => void;
  onEditStock?: (beer: BeerCardProps) => void;
  onDelete?: (beer: BeerCardProps) => void;
  loading?: boolean; // Ajout pour spinner/bouton
}

export default function BeerCardHorizontal({
  beer,
  onEdit,
  onEditStock,
  onDelete,
  loading,
}: BeerCardHorizontalProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image style={styles.image} source={{ uri: beer.image }} />

      {/* Infos */}
      <View style={styles.infoContainer}>
        {/* Menu icon */}
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setShowMenu(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          disabled={loading}
        >
          <AppIcon name="ellipsis-vertical" size={23} color="#636360" />
        </TouchableOpacity>

        {/* Titre */}
        <Text style={styles.title}>{beer.name}</Text>

        {/* Attributs */}
        <View style={styles.attrRow}>
          <View style={styles.attrBlock}>
            <Text style={styles.attrLabel}>Style</Text>
            <Text style={styles.attrValue}>{beer.beer_style?.label}</Text>
          </View>
          <View style={styles.attrBlock}>
            <Text style={styles.attrLabel}>Couleur</Text>
            <Text style={styles.attrValue}>{beer.color}</Text>
          </View>
          <View style={styles.attrBlock}>
            <Text style={styles.attrLabel}>Taux</Text>
            <Text style={styles.attrValue}>{beer.abv_rate}%</Text>
          </View>
          <View style={styles.attrBlock}>
            <Text style={styles.attrLabel}>PDV</Text>
            <Text style={styles.attrValue}>{beer.price}€</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          {beer.description}
        </Text>

        {/* Stock */}
        <Text style={styles.stockLabel}>
          Stock en ligne <Text style={styles.stockValue}>{beer.quantity}</Text>
        </Text>
      </View>

      {/* Menu d'actions */}
      <BeerCardActionsMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onEdit={() => {
          setShowMenu(false);
          onEdit?.(beer);
        }}
        onEditStock={() => {
          setShowMenu(false);
          onEditStock?.(beer);
        }}
        onDelete={() => {
          setShowMenu(false);
          onDelete?.(beer);
        }}
      />
    </View>
  );
}

const CARD_HEIGHT = 148;
const CARD_WIDTH = Math.min(Dimensions.get("window").width - 32, 336);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginVertical: 8,
    padding: 8,
    position: "relative",
  },
  image: {
    width: 120,
    height: "100%",
    borderRadius: 8,
    marginRight: 8,
    resizeMode: "cover",
    backgroundColor: "#F5F5F5",
  },
  infoContainer: {
    flex: 1,
    flexDirection: "column",
    position: "relative",
    justifyContent: "flex-start",
    paddingRight: 2,
  },
  menuBtn: {
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 2,
    padding: 4,
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    color: "#000",
    marginBottom: 2,
    marginLeft: 0,
    marginTop: 4,
    paddingRight: 32,
    letterSpacing: -0.63,
  },
  attrRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 2,
  },
  attrBlock: {
    alignItems: "flex-start",
    marginRight: 10,
  },
  attrLabel: {
    fontSize: 10,
    color: "#636360",
    fontWeight: "300",
    letterSpacing: -0.3,
  },
  attrValue: {
    fontSize: 10,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 8,
    color: "#A09C9C",
    fontWeight: "300",
    marginVertical: 3,
    marginRight: 4,
    lineHeight: 12,
    textAlign: "justify",
  },
  stockLabel: {
    fontSize: 12,
    color: "#000",
    fontWeight: "300",
    marginTop: 4,
  },
  stockValue: {
    fontWeight: "900",
    letterSpacing: -0.36,
  },
});
