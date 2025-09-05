import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { useBreweryData } from "@/contexts/BreweryDataContext";
import { DAY_LABELS, DAYS, OpeningHoursSection, OpeningHours, Day } from "@/app/registerBrewery";
import { COLORS, FONTS, SIZES } from "@/constants";

const createDefaultHours = (): OpeningHours => {
  const obj = {} as OpeningHours;
  DAYS.forEach((day) => {
    obj[day] = { isOpen: false, openTime: "10:00", closeTime: "18:00" };
  });
  return obj;
};

type FormData = {
  description: string;
  phone_number: string;
  email: string;
  has_taproom: boolean;
  taproom_hours: OpeningHours;
  opening_hours: OpeningHours;
  social_links: string;
};

export default function BreweryProfileScreen() {
  const { brewery, loading } = useBreweryData();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    description: "",
    phone_number: "",
    email: "",
    has_taproom: false,
    taproom_hours: createDefaultHours(),
    opening_hours: createDefaultHours(),
    social_links: "",
  });

  useEffect(() => {
    if (brewery) {
      setFormData({
        description: brewery.description || "",
        phone_number: brewery.phone_number || "",
        email: brewery.email || "",
        has_taproom: brewery.has_taproom || false,
        taproom_hours: brewery.taproom_hours || createDefaultHours(),
        opening_hours: brewery.opening_hours || createDefaultHours(),
        social_links: brewery.social_links ? brewery.social_links.join(", ") : "",
      });
    }
  }, [brewery]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!brewery) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Aucune brasserie trouvée.</Text>
      </View>
    );
  }

  const handleChange = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDayOpen = (hoursKey: "taproom_hours" | "opening_hours", day: Day) => {
    const current = formData[hoursKey];
    const newIsOpen = !current[day].isOpen;
    const updatedHours = {
      ...current,
      [day]: { ...current[day], isOpen: newIsOpen },
    };
    handleChange(hoursKey, updatedHours);
  };

  const updateDayTime = (
    hoursKey: "taproom_hours" | "opening_hours",
    day: Day,
    timeKey: "openTime" | "closeTime",
    value: string,
  ) => {
    const current = formData[hoursKey];
    const updatedHours = {
      ...current,
      [day]: { ...current[day], [timeKey]: value },
    };
    handleChange(hoursKey, updatedHours);
  };

  const getHoursSummary = (hoursObj: OpeningHours) => {
    return DAYS.map((day) => {
      const d = hoursObj[day];
      if (!d.isOpen) return `${DAY_LABELS[day]} : fermé`;
      return `${DAY_LABELS[day]} : ${d.openTime} - ${d.closeTime}`;
    }).join("\n");
  };

  const onSave = async () => {
    try {
      const _payload = {
        description: formData.description,
        brewery_phone_number: formData.phone_number,
        brewery_email: formData.email,
        has_taproom: formData.has_taproom,
        taproom_hours: formData.taproom_hours,
        opening_hours: formData.opening_hours,
        social_links: formData.social_links
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
      };
      // TODO: API save call

      Alert.alert("Succès", "Profil mis à jour !");
      setEditMode(false);
    } catch {
      Alert.alert("Erreur", "Impossible de sauvegarder les données.");
    }
  };

  const renderSocialLinks = () => {
    if (!brewery.social_links || brewery.social_links.length === 0) {
      return <Text style={styles.valueText}>Aucun lien social</Text>;
    }
    return brewery.social_links.map((link, i) => (
      <Text
        key={i}
        style={[styles.valueText, styles.linkText]}
        onPress={() => Linking.openURL(link)}
      >
        {link}
      </Text>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {brewery.logo ? (
        <Image source={{ uri: brewery.logo }} style={styles.logo} resizeMode="contain" />
      ) : (
        <View style={[styles.logo, styles.logoPlaceholder]}>
          <Text style={styles.logoPlaceholderText}>Pas de logo</Text>
        </View>
      )}

      <Text style={styles.name}>{brewery.name}</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Description</Text>
        {editMode ? (
          <TextInput
            style={[styles.textArea, styles.input]}
            multiline
            placeholder="Décrivez votre brasserie"
            value={formData.description}
            onChangeText={(text) => handleChange("description", text)}
          />
        ) : (
          <Text style={styles.valueText}>{brewery.description || "-"}</Text>
        )}
      </View>

      <View style={styles.rowCard}>
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Téléphone</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              placeholder="+33 6 12 34 56 78"
              keyboardType="phone-pad"
              value={formData.phone_number}
              onChangeText={(text) => handleChange("phone_number", text)}
            />
          ) : (
            <Text style={styles.valueText}>{brewery.phone_number || "-"}</Text>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Email</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              placeholder="exemple@mail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
            />
          ) : (
            <Text style={styles.valueText}>{brewery.email || "-"}</Text>
          )}
        </View>
      </View>

      <View style={[styles.card, styles.switchCard]}>
        <Text style={styles.sectionTitle}>Taproom</Text>
        <View style={styles.switchRow}>
          <Text style={[styles.valueText, { fontWeight: "600" }]}>Possède un taproom ?</Text>
          {editMode ? (
            <Switch
              value={formData.has_taproom}
              onValueChange={(val) => handleChange("has_taproom", val)}
              trackColor={{ false: "#ccc", true: "#4ade80" }}
              thumbColor={formData.has_taproom ? "#16a34a" : "#f4f3f4"}
            />
          ) : (
            <Text style={styles.valueText}>{brewery.has_taproom ? "Oui" : "Non"}</Text>
          )}
        </View>
      </View>

      {formData.has_taproom && (
        <View style={styles.card}>
          <OpeningHoursSection
            title="Horaires de la taproom"
            hours={formData.taproom_hours}
            onToggleDay={(day) => toggleDayOpen("taproom_hours", day)}
            onUpdateTime={(day, timeKey, val) => updateDayTime("taproom_hours", day, timeKey, val)}
            summary={getHoursSummary(formData.taproom_hours)}
          />
        </View>
      )}

      <View style={styles.card}>
        <OpeningHoursSection
          title="Horaires d'ouverture"
          hours={formData.opening_hours}
          onToggleDay={(day) => toggleDayOpen("opening_hours", day)}
          onUpdateTime={(day, timeKey, val) => updateDayTime("opening_hours", day, timeKey, val)}
          summary={getHoursSummary(formData.opening_hours)}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Liens sociaux</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={formData.social_links}
            onChangeText={(text) => handleChange("social_links", text)}
            placeholder="https://facebook.com/..., https://instagram.com/..."
            autoCapitalize="none"
          />
        ) : (
          <View style={styles.socialLinksContainer}>{renderSocialLinks()}</View>
        )}
      </View>

      <View style={styles.buttonsRow}>
        {editMode ? (
          <>
            <TouchableOpacity style={styles.button} onPress={onSave} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Sauvegarder</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setEditMode(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.cancelButtonText]}>Annuler</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setEditMode(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding3,
    paddingBottom: 50,
    backgroundColor: COLORS.secondaryWhite,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: SIZES.h3,
    color: COLORS.gray,
  },
  logo: {
    width: "100%",
    height: 150,
    borderRadius: SIZES.radius / 2,
    backgroundColor: COLORS.greyscale300,
    marginBottom: SIZES.padding3,
  },
  logoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoPlaceholderText: {
    color: COLORS.grayTie,
    fontSize: SIZES.h4,
  },
  name: {
    ...FONTS.h1,
    color: COLORS.black,
    marginBottom: SIZES.padding3,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius / 2,
    padding: SIZES.padding3,
    marginBottom: SIZES.padding3 * 2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  rowCard: {
    flexDirection: "column",
    marginBottom: SIZES.padding3 * 2,
    gap: SIZES.padding2,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius / 2,
    padding: SIZES.padding3,
    flex: 1,
    marginBottom: SIZES.padding2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginRight: SIZES.padding2,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: SIZES.padding2,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.secondary,
    paddingBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
    borderRadius: SIZES.radius / 3,
    paddingVertical: SIZES.padding2,
    paddingHorizontal: SIZES.padding3,
    fontSize: SIZES.body3,
    backgroundColor: COLORS.greyscale500,
    color: COLORS.black2,
    marginBottom: SIZES.padding2,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  valueText: {
    fontSize: SIZES.body3,
    color: COLORS.gray2,
  },
  linkText: {
    color: COLORS.success,
    textDecorationLine: "underline",
    marginBottom: 6,
  },
  switchCard: {
    flexDirection: "column",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: SIZES.padding3 * 2,
    marginBottom: 50,
    gap: SIZES.padding2,
  },
  button: {
    backgroundColor: COLORS.success,
    paddingVertical: SIZES.padding3,
    paddingHorizontal: SIZES.padding3 * 3,
    borderRadius: SIZES.radius,
    minWidth: 140,
    alignItems: "center",
    shadowColor: COLORS.success,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.greyscale500,
    shadowColor: COLORS.gray,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: SIZES.body3,
  },
  cancelButtonText: {
    color: COLORS.gray2,
    fontWeight: "700",
    fontSize: SIZES.body3,
  },
  socialLinksContainer: {
    flexDirection: "column",
  },
});
