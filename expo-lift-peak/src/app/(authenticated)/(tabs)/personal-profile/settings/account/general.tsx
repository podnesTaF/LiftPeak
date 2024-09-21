import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "@shared/styles";
import { FormProvider, useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons
import { Picker } from "@react-native-picker/picker";
import FormField from "@shared/components/form/formfield/FormField";
import CustomBottomSheet from "@shared/components/bottomSheet/CustomBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import GenderSelector from "@shared/components/GenderSelector";
import BirthdateSelector from "@shared/components/BirthdateSelector";
import { useNavigation } from "expo-router";
import { useProfileStore } from "@features/profile/store";

const General = () => {

  const [birthdate, setBirthdate] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);

  const handleSelectBirthdate = (date: string) => {
    setBirthdate(date)
  }

  const handleSelectGender = (selectedGender: string) => {
    setGender(selectedGender)
  }

  console.log("gender:", gender, "birthdate:", birthdate)

  const form = useForm({
    mode: "onChange",
  });

  const navigation = useNavigation();

  const {profile, username} = useProfileStore()
  const {setValue} = form;

  useEffect(() => {
    setValue("firstName", profile.firstName)
    setValue("lastName", profile.lastName)
    setValue("username", username)

  })


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity>
          <Text style={{fontSize: 17, color: Colors.successLight, paddingEnd: 5}}>Save</Text>
        </TouchableOpacity>
      )
    })
  }, [navigation])


  return (
    <FormProvider {...form}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ backgroundColor: Colors.dark700, flex: 1 }}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="earth" size={20} color={Colors.white} />
            <Text style={styles.sectionHeader}>Public Information</Text>
          </View>
          <FormField
            name="firstName"
            label="First name"
            placeholder="Enter your first name"
            noValidationStyling
          />
          <FormField
            name="lastName"
            label="Last name"
            placeholder="Enter your last name"
            noValidationStyling
          />
          <FormField
            name="username"
            label="Username"
            placeholder="Enter your username"
            noValidationStyling
          />

          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="lock-closed" size={20} color={Colors.white} />
            <Text style={styles.sectionHeader}>Private Information</Text>
          </View>
          <GenderSelector label="Gender" onSelect={handleSelectGender}/>
          <BirthdateSelector label="Birthdate" onSelect={handleSelectBirthdate}/>
        </ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};

export default General;

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
    marginBottom: 30,
    marginHorizontal: 24,
    marginTop: 38,
    flex: 1,
    gap: 20,
  },
  inputWrapper: {
    borderRadius: 8,
    backgroundColor: Colors.dark500,
    color: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 18,
    color: Colors.white,
    marginLeft: 8,
  },
});
