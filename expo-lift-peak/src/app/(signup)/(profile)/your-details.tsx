import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@shared/components/Button";
import DropDown from "@shared/components/DropDown";
import FormField from "@shared/components/form/FormField";
import { defaultStyles } from "@shared/styles";
import { useRouter } from "expo-router";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import React, { useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const YourDetails = () => {
  const router = useRouter();

  const { formState, trigger } = useFormContext();

  const usernameError = formState.errors.username;
  const phoneError = formState.errors.phone;
  const birthdateError = formState.errors.birthdate;
  const genderError = formState.errors.gender;

  const usernameValue = useWatch({
    name: "username",
  });

  const phoneValue = useWatch({
    name: "phone",
  });

  const birthdateValue = useWatch({
    name: "birthdate",
  });

  const genderValue = useWatch({
    name: "gender",
  });

  const isDisabled =
    !!usernameError ||
    !!phoneError ||
    !!birthdateError ||
    !usernameValue ||
    !phoneValue ||
    !birthdateValue ||
    !genderValue ||
    !!genderError;

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
              <FormField
                placeholder="Enter your username"
                name="username"
                label="Username"
                noValidationStyling
              />

              <DropDown
                data={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "noOther", label: "No Other" },
                ]}
                name={"gender"}
                onChange={console.log}
                placeholder="Select your gender"
                label="Gender"
              />
              <FormField
                placeholder="Select your birthdate"
                name="birthdate"
                label="Birthdate"
                type="date"
                noValidationStyling
              />
              <FormField
                placeholder="Enter your phone number"
                name="phone"
                label="Phone"
                type="phone"
                noValidationStyling
              />
            </View>

            <Button
              disabled={isDisabled}
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
