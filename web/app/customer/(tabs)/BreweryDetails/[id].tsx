import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useClientData } from "@/contexts/CostumerDataProvider";
import { BreweryProps } from "@/components/brewery/BreweryCardSmall";
import { OpeningHoursDetail } from "@/app/registerBrewery";

export default function BreweryDetails() {
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const { getBreweryById } = useClientData();

  const [breweryData, setBreweryData] = useState<BreweryProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    getBreweryById(id)
      .then((b) => {
        if (mounted) setBreweryData(b ?? null);
      })
      .catch((err) => console.error("Erreur fetch brewery:", err))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading)
    return (
      <View style={styles.errorContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  if (!breweryData)
    return (
      <View style={styles.errorContainer}>
        <Text>Données de la brasserie introuvables.</Text>
      </View>
    );

  const renderHours = (
    hoursObj?: Record<string, string | { isOpen: boolean; openTime?: string; closeTime?: string }>,
  ) => {
    if (!hoursObj) return null;

    return Object.entries(hoursObj).map(([day, hours]) => {
      if (typeof hours === "string") {
        return (
          <Text key={day} style={styles.text}>
            {day}: {hours}
          </Text>
        );
      }

      if (typeof hours === "object" && hours !== null) {
        const { isOpen, openTime, closeTime } = hours as OpeningHoursDetail;
        return (
          <Text key={day} style={styles.text}>
            {day}: {isOpen ? `${openTime ?? "?"} - ${closeTime ?? "?"}` : "Fermé"}
          </Text>
        );
      }

      return null;
    });
  };

  const renderSocialLinks = () => {
    if (!breweryData?.social_links || breweryData.social_links.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Réseaux sociaux</Text>
        {breweryData.social_links.map((link, index) => (
          <Text key={index} style={styles.linkText}>
            {link}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{breweryData.name}</Text>

      {(breweryData.logo || breweryData.image) && (
        <Image
          source={{ uri: breweryData.logo ?? breweryData.image ?? "" }}
          style={styles.logo}
          resizeMode="contain"
        />
      )}

      <Text style={styles.description}>{breweryData.description}</Text>

      {breweryData.address && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse et coordonnées</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              📍 {breweryData.address.line_1} {breweryData.address.postal_code} {breweryData.address.city}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        {breweryData.phone_number && (
          <Text style={styles.text}>Tel: {breweryData.phone_number}</Text>
        )}
        {breweryData.email && <Text style={styles.text}>Email: {breweryData.email}</Text>}
      </View>

      {breweryData.opening_hours && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horaires</Text>
          {renderHours(breweryData.opening_hours)}
        </View>
      )}

      {breweryData.has_taproom && breweryData.taproom_hours && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Taproom</Text>
          {renderHours(breweryData.taproom_hours)}
        </View>
      )}

      {renderSocialLinks()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "HankenGrotesk",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "HankenGrotesk",
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 16,
    alignSelf: "center",
  },
  description: {
    fontSize: 16,
    color: "#636360",
    marginBottom: 16,
    fontFamily: "HankenGrotesk",
    fontWeight: "200",
    textAlign: "justify",
    lineHeight: 18,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: "HankenGrotesk",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 8,
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: "#E21221",
    borderRadius: 8,
  },
  addressText: {
    fontSize: 12,
    color: "#000",
    fontFamily: "HankenGrotesk",
    fontWeight: "200",
    lineHeight: 14,
    textAlign: "justify",
    borderWidth: 1,
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 14,
    color: "#555",
    fontFamily: "HankenGrotesk",
  },
  linkText: {
    color: "#1E90FF",
    textDecorationLine: "underline",
    marginBottom: 4,
    fontFamily: "HankenGrotesk",
  },
});
