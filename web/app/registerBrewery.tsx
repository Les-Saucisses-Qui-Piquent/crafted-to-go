import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";
import { router } from "expo-router";
import Input from "../components/form/Input";
import SelectInput from "../components/form/SelectInput";
import TextCTA from "../components/Buttons/TextCTA";
import SecondaryCTA from "../components/Buttons/SecondaryCTA";
import { useAuth } from "@/contexts/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";

//CONSTANTES POUR L'AFFICHAGE DES JOURS EN FRANCAIS ET LA GENERATION DES HORAIRES
const DAY_LABELS: Record<Day, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
} as const;

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { label: `${hour}:00`, value: `${hour}:00` };
});

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type Day = (typeof DAYS)[number];

//INTERFACES ET MESSAGES D'ERREUR POUR LA VALIDATION DU FORMULAIRE
type FormErrors = {
  first_name?: string;
  last_name?: string;
  owner_phone_number?: string;
  owner_email?: string;
  password?: string;
  confirmPassword?: string;
  address_line_1?: string;
  address_line_2?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  brewery_name?: string;
  rib?: string;
  siren?: string;
  brewery_phone_number?: string;
  brewery_email?: string;
  description?: string;
  website?: string;
  main_social?: string;
};

const ERROR_MESSAGES = {
  REQUIRED_FIELD: "Ce champ est requis",
  INVALID_PHONE: "Le numéro de téléphone doit contenir 10 chiffres",
  INVALID_POSTAL: "Le code postal doit contenir 5 chiffres",
  INVALID_SIREN: "Le numéro SIREN doit contenir 9 chiffres",
  INVALID_EMAIL: "L'adresse email n'est pas valide",
  PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 12 caractères",
  PASSWORDS_DONT_MATCH: "Les mots de passe ne correspondent pas",
};

//LISTE DES FIELDS REQUIRED POUR VALIDER LE FORMULAIRE : a modifier en fonction de l'évolution du schéma
const REQUIRED_FIELDS = {
  first_name: "Prénom",
  last_name: "Nom",
  owner_phone_number: "Numéro de téléphone",
  owner_email: "Email",
  password: "Mot de passe",
  confirmPassword: "Confirmation du mot de passe",
  birth_date: "Date de naissance",

  address_line_1: "Adresse",
  postal_code: "Code postal",
  city: "Ville",
  country: "Pays",

  brewery_name: "Nom de la brasserie",
  rib: "RIB",
  siren: "SIREN",
  brewery_phone_number: "Téléphone de la brasserie",
  brewery_email: "Email de la brasserie",
  description: "Description",
  website: "Site internet",
  main_social: "Réseau social principal",
  opening_hours: "Horaires d'ouverture",
} as const;

//TYPES POUR LA STRUCTURE DU FORMULAIRE D'INSCRIPTION D'UNE BRASSERIE
type BreweryOwner = {
  first_name: string;
  last_name: string;
  owner_phone_number: string;
  birth_date: Date | undefined;
  owner_email: string;
  password: string;
  confirmPassword: string;
};

type Address = {
  address_line_1: string;
  address_line_2?: string;
  postal_code: string;
  city: string;
  country: string;
};

type Brewery = {
  brewery_name: string;
  rib: string;
  siren: string;
};

type OpeningHoursDetail = {
  isOpen: boolean;
  openTime?: string; // Optionnel si isOpen est false
  closeTime?: string; // Optionnel si isOpen est false
};

type OpeningHours = Record<Day, OpeningHoursDetail>;

type BreweryDetail = {
  description: string;
  social_links: string[];
  opening_hours: OpeningHours;
  has_taproom: boolean;
  taproom_hours: OpeningHours;
  image: string;
  logo: string;
  brewery_phone_number: string;
  brewery_email: string;
};

type BreweryFormState = BreweryOwner & Address & Brewery & BreweryDetail;

interface OpeningHoursSectionProps {
  title: string;
  hours: OpeningHours;
  onToggleDay: (day: Day) => void;
  onUpdateTime: (day: Day, timeType: "openTime" | "closeTime", time: string) => void;
  summary: string;
}

const OpeningHoursSection: React.FC<OpeningHoursSectionProps> = ({
  title,
  hours,
  onToggleDay,
  onUpdateTime,
  summary,
}) => {
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      {DAYS.map((dayKey) => (
        <View key={dayKey} style={styles.dayRow}>
          <TouchableOpacity style={styles.dayCheckboxContainer} onPress={() => onToggleDay(dayKey)}>
            <View style={[styles.dayCheckbox, hours[dayKey].isOpen && styles.dayCheckboxChecked]}>
              {hours[dayKey].isOpen && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.dayLabel}>{DAY_LABELS[dayKey]}</Text>
          </TouchableOpacity>

          {hours[dayKey].isOpen && (
            <View style={styles.timeSelectors}>
              <SelectInput
                label="Ouverture"
                items={TIME_OPTIONS}
                width={165}
                onValueChange={(value) => onUpdateTime(dayKey, "openTime", value)}
                selectedValue={hours[dayKey].openTime}
              />
              <SelectInput
                label="Fermeture"
                items={TIME_OPTIONS}
                width={165}
                onValueChange={(value) => onUpdateTime(dayKey, "closeTime", value)}
                selectedValue={hours[dayKey].closeTime}
              />
            </View>
          )}
        </View>
      ))}

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Résumé des horaires :</Text>
        <Text style={styles.summaryText}>{summary}</Text>
      </View>
    </>
  );
};

interface AdditionalSocialInputProps {
  index: number;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
}

const AdditionalSocialInput: React.FC<AdditionalSocialInputProps> = ({
  index,
  onRemove,
  onChange,
}) => {
  return (
    <View style={styles.socialInputContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.inputLabel}>Réseau social {index + 2}</Text>
        <TouchableOpacity onPress={() => onRemove(index)}>
          <Text style={styles.removeText}>(supprimer)</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputWithoutLabel}>
        <TextInput
          style={styles.customInput}
          placeholder="https://facebook.com/ma-brasserie"
          placeholderTextColor={COLORS.black}
          onChangeText={(text) => onChange(index, text)}
        />
      </View>
    </View>
  );
};

const RegisterBrewery = () => {
  const { setToken, setUser } = useAuth();
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Affiche les champs requis en rouge dès le chargement de la page : convenient for testing but can be removed
  const initialErrors: FormErrors = {};
  Object.keys(REQUIRED_FIELDS).forEach((field) => {
    initialErrors[field as keyof FormErrors] = ERROR_MESSAGES.REQUIRED_FIELD;
  });
  const [formErrors, setFormErrors] = useState<FormErrors>(initialErrors);

  const [formState, setFormState] = useState<BreweryFormState>({
    // Brewery Owner fields
    first_name: "",
    last_name: "",
    owner_phone_number: "",
    birth_date: undefined,
    owner_email: "",
    password: "",
    confirmPassword: "",

    // Address fields
    address_line_1: "",
    address_line_2: undefined,
    postal_code: "",
    city: "",
    country: "France",

    // Brewery fields
    brewery_name: "",
    rib: "",
    siren: "",

    // Brewery Detail fields
    description: "",
    social_links: [],
    opening_hours: {
      monday: { isOpen: false },
      tuesday: { isOpen: false },
      wednesday: { isOpen: false },
      thursday: { isOpen: false },
      friday: { isOpen: false },
      saturday: { isOpen: false },
      sunday: { isOpen: false },
    },
    has_taproom: false,
    taproom_hours: {
      monday: { isOpen: false },
      tuesday: { isOpen: false },
      wednesday: { isOpen: false },
      thursday: { isOpen: false },
      friday: { isOpen: false },
      saturday: { isOpen: false },
      sunday: { isOpen: false },
    },
    image: "",
    logo: "",
    brewery_phone_number: "",
    brewery_email: "",
  });

  const inputChangedHandler = (id: string, text: string) => {
    setFormState((prev) => ({
      ...prev,
      [id]: text,
    }));

    // Valider le champ en temps réel
    const error = validateField(id as keyof BreweryFormState, text);
    setFormErrors((prev) => ({
      ...prev,
      [id]: error,
    }));

    // Vérifier les mots de passe si nécessaire
    if (id === "password" || id === "confirmPassword") {
      if (id === "password" && text.length < 12) {
        setFormErrors((prev) => ({
          ...prev,
          password: ERROR_MESSAGES.PASSWORD_TOO_SHORT,
        }));
      }
      if (formState.confirmPassword && text !== formState.confirmPassword) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: ERROR_MESSAGES.PASSWORDS_DONT_MATCH,
        }));
      } else if (formState.password && text !== formState.password) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: ERROR_MESSAGES.PASSWORDS_DONT_MATCH,
        }));
      }
    }
  };

  const toggleTaproom = () => {
    setFormState((prev) => ({
      ...prev,
      has_taproom: !prev.has_taproom,
    }));
  };

  const addAdditionalSocial = () => {
    setFormState((prev) => ({
      ...prev,
      social_links: [...prev.social_links, ""],
    }));
  };

  const removeAdditionalSocial = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index),
    }));
  };

  const updateAdditionalSocial = (index: number, value: string) => {
    setFormState((prev) => ({
      ...prev,
      social_links: prev.social_links.map((social, i) => (i === index ? value : social)),
    }));
  };

  const toggleDayOpen = (day: Day) => {
    setFormState((prev) => {
      const isCurrentlyOpen = prev.opening_hours[day].isOpen;
      return {
        ...prev,
        opening_hours: {
          ...prev.opening_hours,
          [day]: isCurrentlyOpen
            ? { isOpen: false } // Supprime les horaires quand on ferme
            : { isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Ajoute des horaires par défaut quand on ouvre
        },
      };
    });
  };

  const updateDayTime = (day: Day, timeType: "openTime" | "closeTime", time: string) => {
    setFormState((prev) => ({
      ...prev,
      opening_hours: {
        ...prev.opening_hours,
        [day]: {
          ...prev.opening_hours[day],
          [timeType]: time,
        },
      },
    }));
  };

  const toggleTaproomDayOpen = (day: Day) => {
    setFormState((prev) => {
      const isCurrentlyOpen = prev.taproom_hours[day].isOpen;
      return {
        ...prev,
        taproom_hours: {
          ...prev.taproom_hours,
          [day]: isCurrentlyOpen
            ? { isOpen: false } // Supprime les horaires quand on ferme
            : { isOpen: true, openTime: "16:00", closeTime: "22:00" }, // Ajoute des horaires par défaut quand on ouvre
        },
      };
    });
  };

  const updateTaproomDayTime = (day: Day, timeType: "openTime" | "closeTime", time: string) => {
    setFormState((prev) => ({
      ...prev,
      taproom_hours: {
        ...prev.taproom_hours,
        [day]: {
          ...prev.taproom_hours[day],
          [timeType]: time,
        },
      },
    }));
  };

  const getOpeningHoursSummary = () => {
    const openDays = Object.entries(formState.opening_hours)
      .filter(([_, hours]) => hours.isOpen)
      .map(
        ([day, hours]) =>
          `${DAY_LABELS[day as keyof typeof DAY_LABELS]}: ${hours.openTime} - ${hours.closeTime}`,
      );

    if (openDays.length === 0) {
      return "Aucun jour d'ouverture sélectionné";
    }

    return openDays.join(" • ");
  };

  const getTaproomHoursSummary = () => {
    const openDays = Object.entries(formState.taproom_hours)
      .filter(([_, hours]) => hours.isOpen)
      .map(
        ([day, hours]) =>
          `${DAY_LABELS[day as keyof typeof DAY_LABELS]}: ${hours.openTime} - ${hours.closeTime}`,
      );

    if (openDays.length === 0) {
      return "Aucun jour d'ouverture sélectionné pour la taproom";
    }

    return openDays.join(" • ");
  };

  const validateField = (id: keyof BreweryFormState, value: string): string | undefined => {
    if (id in REQUIRED_FIELDS && !value.trim()) {
      return ERROR_MESSAGES.REQUIRED_FIELD;
    }

    switch (id) {
      case "owner_phone_number":
        return value.length !== 10 ? ERROR_MESSAGES.INVALID_PHONE : undefined;
      case "postal_code":
        return value.length !== 5 ? ERROR_MESSAGES.INVALID_POSTAL : undefined;
      case "siren":
        return value.length !== 9 ? ERROR_MESSAGES.INVALID_SIREN : undefined;
      case "owner_email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? ERROR_MESSAGES.INVALID_EMAIL : undefined;
      default:
        return undefined;
    }
  };

  const validateForm = () => {
    // Check required fields
    const missingFields = Object.entries(REQUIRED_FIELDS)
      .filter(([key]) => {
        const value = formState[key as keyof typeof formState];
        return !value || (typeof value === "string" && value.trim() === "");
      })
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      Alert.alert("Oops", `Les champs suivants sont requis: ${missingFields.join(", ")}`);
      return false;
    }

    // Validate phone number
    if (formState.owner_phone_number.length !== 10) {
      Alert.alert("Oops", "Le numéro de téléphone doit contenir 10 chiffres");
      return false;
    }

    // Validate postal code
    if (formState.postal_code.length !== 5) {
      Alert.alert("Oops", "Le code postal doit contenir 5 chiffres");
      return false;
    }

    // Validate SIREN (should be 9 digits)
    if (formState.siren.length !== 9) {
      Alert.alert("Oops", "Le SIREN doit contenir 9 chiffres");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // TODO: Implement brewery registration API call
        // For now, we'll just log the data
        console.info("Registering brewery...", formState);
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/brewery/register`, {
          method: "POST",
          body: JSON.stringify(formState),
        });
        if (!response.ok) {
          throw new Error("Failed to register brewery");
        }

        const data = await response.json();
        console.info("Brewery registered successfully:", data);

        // Alert.alert(
        //   "Inscription en cours",
        //   "La fonctionnalité d'inscription brasserie sera bientôt disponible. Vos données ont été validées avec succès !",
        // );

        // Temporary navigation back to index
        router.push("/");
      } catch (error) {
        console.error("Registration failed from front:");
        console.error(error);
        Alert.alert("Erreur", "Une erreur est survenue lors de l'inscription");
      }
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}></View>
          <Text
            style={[
              styles.title,
              {
                color: COLORS.black,
              },
            ]}
          >
            CRÉER VOTRE BRASSERIE
          </Text>

          <View style={styles.formContainer}>
            {/* Brewery Owner Information */}
            <Text style={styles.sectionTitle}>Informations personnelles</Text>

            <Input
              label="Prénom"
              id="first_name"
              onInputChanged={inputChangedHandler}
              placeholder="Prénom"
              placeholderTextColor={COLORS.black}
              error={formErrors.first_name}
            />

            <Input
              label="Nom"
              id="last_name"
              onInputChanged={inputChangedHandler}
              placeholder="Nom"
              placeholderTextColor={COLORS.black}
              error={formErrors.last_name}
            />

            <Input
              label="Numéro de téléphone"
              id="phone_number"
              onInputChanged={inputChangedHandler}
              placeholder="0123456789"
              placeholderTextColor={COLORS.black}
              keyboardType="phone-pad"
              error={formErrors.owner_phone_number}
            />

            {/* TODO: Uncomment when date picker is needed */}
            {/* <TextCTA
              title="Date de naissance"
              onPress={() => setShowDatePicker(true)}
              width={350}
            />
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="inline"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  setFormState((prev) => ({
                    ...prev,
                    birth_date: selectedDate,
                  }));
                }}
                maximumDate={new Date()}
              />
            )} */}

            <Input
              label="Email"
              id="email"
              onInputChanged={inputChangedHandler}
              placeholder="email@exemple.com"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              error={formErrors.owner_email}
            />

            <Input
              label="Mot de passe"
              id="password"
              secureTextEntry
              onInputChanged={inputChangedHandler}
              placeholder="Mot de passe"
              placeholderTextColor={COLORS.black}
              error={formErrors.password}
            />

            <Input
              label="Confirmer le mot de passe"
              id="confirmPassword"
              secureTextEntry
              onInputChanged={inputChangedHandler}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={COLORS.black}
              error={formErrors.confirmPassword}
            />

            {/* Address Information */}
            <Text style={styles.sectionTitle}>Adresse</Text>

            <Input
              label="Adresse"
              id="address_line_1"
              onInputChanged={inputChangedHandler}
              placeholder="123 Rue de la Brasserie"
              placeholderTextColor={COLORS.black}
              error={formErrors.address_line_1}
            />

            <Input
              label="Complément d'adresse (optionnel)"
              id="address_line_2"
              onInputChanged={inputChangedHandler}
              placeholder="Appartement, étage, etc."
              placeholderTextColor={COLORS.black}
              error={formErrors.address_line_2}
            />

            <Input
              label="Code postal"
              id="postal_code"
              onInputChanged={inputChangedHandler}
              placeholder="75001"
              placeholderTextColor={COLORS.black}
              keyboardType="numeric"
              error={formErrors.postal_code}
            />

            <Input
              label="Ville"
              id="city"
              onInputChanged={inputChangedHandler}
              placeholder="Paris"
              placeholderTextColor={COLORS.black}
              error={formErrors.city}
            />

            <Input
              label="Pays"
              id="country"
              onInputChanged={inputChangedHandler}
              placeholder="France"
              placeholderTextColor={COLORS.black}
              error={formErrors.country}
            />

            {/* Brewery Information */}
            <Text style={styles.sectionTitle}>Informations de la brasserie</Text>

            <Input
              label="Nom de la brasserie"
              id="brewery_name"
              onInputChanged={inputChangedHandler}
              placeholder="Ma Super Brasserie"
              placeholderTextColor={COLORS.black}
              error={formErrors.brewery_name}
            />

            <Input
              label="RIB"
              id="rib"
              onInputChanged={inputChangedHandler}
              placeholder="FR76 1234 5678 9012 3456 7890 123"
              placeholderTextColor={COLORS.black}
              error={formErrors.rib}
            />

            <Input
              label="SIREN"
              id="siren"
              onInputChanged={inputChangedHandler}
              placeholder="123456789"
              placeholderTextColor={COLORS.black}
              keyboardType="numeric"
              error={formErrors.siren}
            />

            <Input
              label="Téléphone de la brasserie"
              id="brewery_phone_number"
              onInputChanged={inputChangedHandler}
              placeholder="0123456789"
              placeholderTextColor={COLORS.black}
              keyboardType="numeric"
              error={formErrors.brewery_phone_number}
            />

            <Input
              label="Email de la brasserie"
              id="brewery_email"
              onInputChanged={inputChangedHandler}
              placeholder="awesome@brew.com"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              error={formErrors.brewery_email}
            />

            <Input
              label="Description"
              id="description"
              onInputChanged={inputChangedHandler}
              placeholder="Décrivez votre brasserie..."
              placeholderTextColor={COLORS.black}
              error={formErrors.description}
            />

            <Input
              label="Site internet"
              id="website"
              onInputChanged={inputChangedHandler}
              placeholder="https://www.ma-brasserie.com"
              placeholderTextColor={COLORS.black}
              error={formErrors.website}
            />

            <Input
              label="Réseau social principal"
              id="main_social"
              onInputChanged={inputChangedHandler}
              placeholder="https://instagram.com/ma-brasserie"
              placeholderTextColor={COLORS.black}
              error={formErrors.main_social}
            />

            {/* Additional Social Networks */}
            {formState.social_links.map((_, index) => (
              <AdditionalSocialInput
                key={index}
                index={index}
                onRemove={removeAdditionalSocial}
                onChange={updateAdditionalSocial}
              />
            ))}

            <SecondaryCTA
              title="+ Ajouter un réseau social"
              isBlack={true}
              tablet={true}
              onPress={addAdditionalSocial}
              style={{ marginTop: 15, marginBottom: 15 }}
            />

            {/* Horaires d'ouverture avec checkboxes et dropdowns */}
            <OpeningHoursSection
              title="Horaires d'ouverture"
              hours={formState.opening_hours}
              onToggleDay={toggleDayOpen}
              onUpdateTime={updateDayTime}
              summary={getOpeningHoursSummary()}
            />

            {/* Taproom Section */}
            <View style={styles.taproomContainer}>
              <TouchableOpacity style={styles.taproomToggle} onPress={toggleTaproom}>
                <View style={[styles.checkbox, formState.has_taproom && styles.checkboxChecked]}>
                  {formState.has_taproom && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.taproomText}>Ma brasserie a une taproom</Text>
              </TouchableOpacity>
            </View>

            {formState.has_taproom && (
              <OpeningHoursSection
                title="Horaires de la taproom"
                hours={formState.taproom_hours}
                onToggleDay={toggleTaproomDayOpen}
                onUpdateTime={updateTaproomDayTime}
                summary={getTaproomHoursSummary()}
              />
            )}

            <View style={styles.buttonContainer}>
              <TextCTA title="Créer ma brasserie" onPress={handleSubmit} width={350} />
            </View>

            <View style={styles.checkBoxContainer}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.privacy,
                      {
                        color: "#666666",
                        fontWeight: "700",
                      },
                    ]}
                  >
                    En continuant, vous acceptez notre Politique de Confidentialité
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.bottomContainer}>
              <Text
                style={[
                  styles.bottomLeft,
                  {
                    color: COLORS.black,
                  },
                ]}
              >
                Vous avez déjà un compte ?
              </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.bottomRight}> Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: "HankenGrotesk",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "HankenGrotesk",
    color: COLORS.black,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 15,
    textAlign: "center",
  },
  formContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  privacy: {
    fontSize: 12,
    fontFamily: "HankenGrotesk",
    color: "#666666",
    fontWeight: "400",
    textAlign: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: "HankenGrotesk",
    color: "black",
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "HankenGrotesk",
    color: COLORS.primary,
    fontWeight: "600",
  },
  taproomContainer: {
    marginVertical: 15,
  },
  taproomToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1.5,
    borderColor: COLORS.black,
    borderRadius: 4,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  taproomText: {
    fontSize: 16,
    fontFamily: "HankenGrotesk",
    color: COLORS.black,
  },

  socialInputContainer: {
    width: 350,
    marginVertical: 10,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 15,
    fontFamily: "HankenGrotesk",
    color: COLORS.black,
    fontWeight: "700",
  },
  removeText: {
    fontSize: 12,
    fontFamily: "HankenGrotesk",
    color: COLORS.black,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
  inputWithoutLabel: {
    width: "100%",
  },
  customInput: {
    textAlign: "left",
    color: "rgba(99, 99, 96, 1)",
    fontFamily: "HankenGrotesk",
    fontSize: 11,
    fontWeight: "300",
    width: "100%",
    height: 34,
    borderStyle: "solid",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 1)",
    borderRadius: 4,
    paddingLeft: 10,
  },
  dayRow: {
    marginVertical: 5,
    width: 350,
  },
  dayCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dayCheckbox: {
    width: 15,
    height: 15,
    borderWidth: 1.5,
    borderColor: COLORS.black,
    borderRadius: 4,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCheckboxChecked: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: "HankenGrotesk",
    color: COLORS.black,
    fontWeight: "400",
  },
  timeSelectors: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
  },
  summaryContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    width: 350,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: "HankenGrotesk",
    color: COLORS.black,
    fontWeight: "600",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 12,
    fontFamily: "HankenGrotesk",
    color: "#666666",
    fontWeight: "400",
    lineHeight: 18,
  },
});

export default RegisterBrewery;
