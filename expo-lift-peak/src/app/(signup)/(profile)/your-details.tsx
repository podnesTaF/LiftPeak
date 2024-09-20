import BirthdateSelector from "@shared/components/BirthdateSelector";
import Button from "@shared/components/Button";
import DropDown from "@shared/components/DropDown";
import FormField from "@shared/components/form/formfield/FormField";
import GenderSelector from "@shared/components/GenderSelector";
import { defaultStyles } from "@shared/styles";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const YourDetails = () => {
  const [birthdate, setBirthdate] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);

  const handleSelectBirthdate = (date: string) => {
    setBirthdate(date)
  }

  const handleSelectGender = (selectedGender: string) => {
    setGender(selectedGender)
  }


  const router = useRouter();

  const handleDetails = () => {
    router.push("/(signup)/(profile)/choose-gym");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[defaultStyles.container]}>
          <View style={{ marginHorizontal: 24, marginTop: 38, flex: 1 }}>
            <View style={{ paddingBottom: 40 }}>
              <Text style={defaultStyles.header}>Your Details</Text>
            </View>

            <View style={{ flex: 1, gap: 20 }}>
            <GenderSelector label="Gender" onSelect={handleSelectGender}/>
            <BirthdateSelector label="Birthdate" onSelect={handleSelectBirthdate}/>
              <FormField
                placeholder="Enter your phone number"
                name="phone"
                label="Phone"
                type="phone"
                noValidationStyling
              />
            </View>

            <Button
              title={"Continue"}
              color={"dark100"}
              onPress={handleDetails}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default YourDetails;
