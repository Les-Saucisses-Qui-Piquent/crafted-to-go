import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import { router } from "expo-router";
import Input from "../components/form/Input";
import TextCTA from "../components/Buttons/TextCTA";
import { useAuth } from "@/contexts/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";

const RegisterBrewery = () => {
  const { setToken, setUser } = useAuth();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formState, setFormState] = useState<{
    // Brewery Owner fields
    first_name: string;
    last_name: string;
    phone_number: string;
    birth_date: Date | undefined;
    email: string;
    password: string;
    confirmPassword: string;
    
    // Address fields
    address_line_1: string;
    address_line_2: string;
    postal_code: string;
    city: string;
    country: string;
    
    // Brewery fields
    brewery_name: string;
    rib: string;
    siren: string;
    
    // Brewery Detail fields
    description: string;
    website: string;
    main_social: string;
    additional_socials: string[];
    opening_hours: string;
    has_taproom: boolean;
    taproom_hours: string;
  }>({
    // Brewery Owner
    first_name: "",
    last_name: "",
    phone_number: "",
    birth_date: undefined,
    email: "",
    password: "",
    confirmPassword: "",
    
    // Address
    address_line_1: "",
    address_line_2: "",
    postal_code: "",
    city: "",
    country: "France",
    
    // Brewery
    brewery_name: "",
    rib: "",
    siren: "",
    
    // Brewery Detail
    description: "",
    website: "",
    main_social: "",
    additional_socials: [],
    opening_hours: "",
    has_taproom: false,
    taproom_hours: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const inputChangedHandler = (id: string, text: string) => {
    setFormState((prev) => ({
      ...prev,
      [id]: text,
    }));

    // Clear password error when user starts typing
    if (id === "password" || id === "confirmPassword") {
      setPasswordError("");
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
      additional_socials: [...prev.additional_socials, ""],
    }));
  };



  const removeAdditionalSocial = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      additional_socials: prev.additional_socials.filter((_, i) => i !== index),
    }));
  };

  const updateAdditionalSocial = (index: number, value: string) => {
    setFormState((prev) => ({
      ...prev,
      additional_socials: prev.additional_socials.map((social, i) => (i === index ? value : social)),
    }));
  };

  const validatePasswords = () => {
    if (formState.password !== formState.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      Alert.alert("Erreur", passwordError);
      return false;
    }
    if (formState.password.length < 12) {
      setPasswordError("Le mot de passe doit contenir au moins 12 caractères");
      Alert.alert("Erreur", passwordError);
      return false;
    }
    console.info("Passwords are matching");
    return true;
  };

  const validateForm = () => {
    const requiredFields = {
      first_name: "Prénom",
      last_name: "Nom",
      phone_number: "Numéro de téléphone",
      // birth_date: "Date de naissance", // Commented out temporarily
      email: "Email",
      password: "Mot de passe",
      address_line_1: "Adresse",
      postal_code: "Code postal",
      city: "Ville",
      country: "Pays",
      brewery_name: "Nom de la brasserie",
      rib: "RIB",
      siren: "SIREN",
      description: "Description",
      opening_hours: "Horaires d'ouverture",
    };

    // Check required fields
    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => {
        const value = formState[key as keyof typeof formState];
        return !value || (typeof value === 'string' && value.trim() === "");
      })
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      Alert.alert("Oops", `Les champs suivants sont requis: ${missingFields.join(", ")}`);
      return false;
    }

    // Validate phone number
    if (formState.phone_number.length !== 10) {
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
    if (validatePasswords() && validateForm()) {
      try {
        // TODO: Implement brewery registration API call
        // For now, we'll just log the data
        console.info("Registering brewery...", formState);
        
        Alert.alert(
          "Inscription en cours", 
          "La fonctionnalité d'inscription brasserie sera bientôt disponible. Vos données ont été validées avec succès !"
        );
        
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
            />

            <Input
              label="Nom"
              id="last_name"
              onInputChanged={inputChangedHandler}
              placeholder="Nom"
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="Numéro de téléphone"
              id="phone_number"
              onInputChanged={inputChangedHandler}
              placeholder="0123456789"
              placeholderTextColor={COLORS.black}
              keyboardType="phone-pad"
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
            />

            <Input
              label="Mot de passe"
              id="password"
              secureTextEntry
              onInputChanged={inputChangedHandler}
              placeholder="Mot de passe"
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="Confirmer le mot de passe"
              id="confirmPassword"
              secureTextEntry
              onInputChanged={inputChangedHandler}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={COLORS.black}
            />

            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {/* Address Information */}
            <Text style={styles.sectionTitle}>Adresse</Text>
            
            <Input
              label="Adresse"
              id="address_line_1"
              onInputChanged={inputChangedHandler}
              placeholder="123 Rue de la Brasserie"
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="Complément d'adresse (optionnel)"
              id="address_line_2"
              onInputChanged={inputChangedHandler}
              placeholder="Appartement, étage, etc."
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="Code postal"
              id="postal_code"
              onInputChanged={inputChangedHandler}
              placeholder="75001"
              placeholderTextColor={COLORS.black}
              keyboardType="numeric"
            />

            <Input
              label="Ville"
              id="city"
              onInputChanged={inputChangedHandler}
              placeholder="Paris"
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="Pays"
              id="country"
              onInputChanged={inputChangedHandler}
              placeholder="France"
              placeholderTextColor={COLORS.black}
            />

            {/* Brewery Information */}
            <Text style={styles.sectionTitle}>Informations de la brasserie</Text>
            
            <Input
              label="Nom de la brasserie"
              id="brewery_name"
              onInputChanged={inputChangedHandler}
              placeholder="Ma Super Brasserie"
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="RIB"
              id="rib"
              onInputChanged={inputChangedHandler}
              placeholder="FR76 1234 5678 9012 3456 7890 123"
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="SIREN"
              id="siren"
              onInputChanged={inputChangedHandler}
              placeholder="123456789"
              placeholderTextColor={COLORS.black}
              keyboardType="numeric"
            />

            <Input
              label="Description"
              id="description"
              onInputChanged={inputChangedHandler}
              placeholder="Décrivez votre brasserie..."
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="Site internet"
              id="website"
              onInputChanged={inputChangedHandler}
              placeholder="https://www.ma-brasserie.com"
              placeholderTextColor={COLORS.black}
            />

            <Input
              label="Réseau social principal"
              id="main_social"
              onInputChanged={inputChangedHandler}
              placeholder="https://instagram.com/ma-brasserie"
              placeholderTextColor={COLORS.black}
            />

            {/* Additional Social Networks */}
            {formState.additional_socials.map((social, index) => (
              <View key={index} style={styles.socialInputContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Réseau social {index + 2}</Text>
                  <TouchableOpacity onPress={() => removeAdditionalSocial(index)}>
                    <Text style={styles.removeText}>(supprimer)</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputWithoutLabel}>
                  <TextInput
                    style={styles.customInput}
                    placeholder="https://facebook.com/ma-brasserie"
                    placeholderTextColor={COLORS.black}
                    onChangeText={(text) => updateAdditionalSocial(index, text)}
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addSocialButton} onPress={addAdditionalSocial}>
              <Text style={styles.addSocialButtonText}>+ Ajouter un réseau social</Text>
            </TouchableOpacity>

            <Input
              label="Horaires d'ouverture"
              id="opening_hours"
              onInputChanged={inputChangedHandler}
              placeholder="Lun-Ven: 9h-18h, Sam: 10h-16h"
              placeholderTextColor={COLORS.black}
            />

            {/* Taproom Section */}
            <View style={styles.taproomContainer}>
              <TouchableOpacity style={styles.taproomToggle} onPress={toggleTaproom}>
                <View style={[styles.checkbox, formState.has_taproom && styles.checkboxChecked]}>
                  {formState.has_taproom && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.taproomText}>Ma brasserie a un taproom</Text>
              </TouchableOpacity>
            </View>

            {formState.has_taproom && (
              <Input
                label="Horaires du taproom"
                id="taproom_hours"
                onInputChanged={inputChangedHandler}
                placeholder="Mar-Dim: 16h-22h"
                placeholderTextColor={COLORS.black}
              />
            )}

            <View style={styles.buttonContainer}>
              <TextCTA
                title="Créer ma brasserie"
                onPress={handleSubmit}
                width={350}
              />
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
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
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

  addSocialButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
    width: 350,
  },
  addSocialButtonText: {
    fontSize: 16,
    fontFamily: "HankenGrotesk",
    color: COLORS.black,
    fontWeight: "600",
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
    fontSize: 14,
    fontFamily: "HankenGrotesk",
    color: "#ff4444",
    fontWeight: "400",
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
});

export default RegisterBrewery;