import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useClientData } from "@/contexts/CostumerDataProvider";
import { BreweryProps } from "@/components/brewery/BreweryCardSmall";
import { OpeningHoursDetail } from "@/app/registerBrewery";
import FilterBar from "@/components/filterBars/FilterBar";

export default function BreweryDetails() {
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const { getBreweryById } = useClientData();

  const [breweryData, setBreweryData] = useState<BreweryProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  
  const tabs = ["Informations", "Catalogue"];

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

    // Ordre logique des jours de la semaine avec traduction française
    const dayOrder = [
      { key: 'monday', label: 'Lundi' },
      { key: 'tuesday', label: 'Mardi' },
      { key: 'wednesday', label: 'Mercredi' },
      { key: 'thursday', label: 'Jeudi' },
      { key: 'friday', label: 'Vendredi' },
      { key: 'saturday', label: 'Samedi' },
      { key: 'sunday', label: 'Dimanche' }
    ];
    
    const sortedEntries = dayOrder
      .map(({ key, label }) => ({ key, label, hours: hoursObj[key] }))
      .filter(({ hours }) => hours !== undefined);

    return (
      <View style={styles.hoursContainer}>
        {sortedEntries.map(({ key, label, hours }) => {
          if (typeof hours === "string") {
            return (
              <View key={key} style={styles.hourRow}>
                <Text style={styles.dayText}>{label}:</Text>
                <Text style={styles.timeText}>{hours}</Text>
              </View>
            );
          }

          if (typeof hours === "object" && hours !== null) {
            const { isOpen, openTime, closeTime } = hours as OpeningHoursDetail;
            return (
              <View key={key} style={styles.hourRow}>
                <Text style={styles.dayText}>{label}:</Text>
                <Text style={[styles.timeText, !isOpen && styles.closedText]}>
                  {isOpen ? `${openTime ?? "?"} - ${closeTime ?? "?"}` : "Fermé"}
                </Text>
              </View>
            );
          }

          return null;
        })}
      </View>
    );
  };

  const formatPhoneNumber = (phone: string) => {
    // Supprime tous les espaces et caractères non numériques sauf le +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Si c'est un numéro français (+33...)
    if (cleanPhone.startsWith('+33')) {
      const number = cleanPhone.slice(3); // Enlève le +33
      // Formate : +33 X XX XX XX XX
      return `+33 ${number.substring(0, 1)} ${number.substring(1, 3)} ${number.substring(3, 5)} ${number.substring(5, 7)} ${number.substring(7, 9)}`;
    }
    
    // Sinon retourne le numéro tel quel
    return phone;
  };

  const renderSocialLinks = () => {
    if (!breweryData?.social_links || breweryData.social_links.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Réseaux sociaux</Text>
        <View style={styles.addressContainer}>
          {breweryData.social_links.map((link, index) => (
            <Text key={index} style={styles.addressText}>
              🌐 {link.toLowerCase()}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderInformationsTab = () => (
    <>
      <Text style={styles.description}>{breweryData?.description}</Text>

      {breweryData?.address && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse et coordonnées</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              📍 {breweryData.address.line_1} {breweryData.address.postal_code} {breweryData.address.city} 
            </Text>
            <Text style={styles.addressText}>📞 Tel: {formatPhoneNumber(breweryData.phone_number)}</Text>
            <Text style={styles.addressText}>✉️ Email: {breweryData.email.toLowerCase()}</Text>
          </View>
        </View>
      )}

      {(breweryData?.opening_hours || (breweryData?.has_taproom && breweryData?.taproom_hours)) && (
        <View style={styles.hoursSection}>
          {breweryData?.opening_hours && (
            <View style={styles.hourColumn}>
              <Text style={styles.sectionTitle}>Horaires</Text>
              {renderHours(breweryData.opening_hours)}
            </View>
          )}

          {breweryData?.has_taproom && breweryData?.taproom_hours && (
            <View style={styles.hourColumn}>
              <Text style={styles.sectionTitle}>Taproom</Text>
              {renderHours(breweryData.taproom_hours)}
            </View>
          )}
        </View>
      )}

      {renderSocialLinks()}
    </>
  );

  const renderCatalogueTab = () => (
    <View style={styles.section}>
      <Text style={styles.text}>test</Text>
    </View>
  );

  const renderTabContent = () => {
    if (selectedTab === 0) {
      return renderInformationsTab();
    } else {
      return renderCatalogueTab();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{breweryData.name}</Text>

      {breweryData.image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: breweryData.image }}
            style={styles.breweryImage}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={styles.filterBarContainer}>
        <FilterBar 
          filters={tabs}
          selectedIndex={selectedTab}
          onSelect={setSelectedTab}
        />
      </View>

      {renderTabContent()}
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
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "left",
    fontFamily: "HankenGrotesk",
  },
  imageContainer: {
    overflow: "hidden",
    paddingBottom: 6,
  },
  breweryImage: {
    width: "100%",
    height: 150,
  },
  filterBarContainer: {
    alignItems: "center",
    marginVertical: 15,
    //paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
    color: "#636360",
    marginVertical: 16,
    fontFamily: "HankenGrotesk",
    fontWeight: "200",
    textAlign: "justify",
    lineHeight: 22,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: "HankenGrotesk",
  },
  addressContainer: {
  },
  addressText: {
    fontSize: 12,
    color: "#000",
    fontFamily: "HankenGrotesk",
    fontWeight: "200",
    lineHeight: 14,
    textAlign: "justify",
    letterSpacing: 0.5,
    paddingBottom: 4,
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
  hoursContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingRight: 10,
  },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  dayText: {
    fontSize: 12,
    fontFamily: "HankenGrotesk",
    fontWeight: "500",
    color: "#000",
    textTransform: "capitalize",
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    fontFamily: "HankenGrotesk",
    fontWeight: "400",
    color: "#666",
    flex: 1,
    textAlign: "right",
  },
  closedText: {
    color: "#999",
    fontStyle: "italic",
  },
  hoursSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 25,
    paddingRight: 10,
  },
  hourColumn: {
    flex: 1,
  },
});
