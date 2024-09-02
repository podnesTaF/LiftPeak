import { SignupSchema, signupSchema } from "@features/auth/utils/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@shared/components/Button";
import DropDown from "@shared/components/DropDown";
import FormField from "@shared/components/form/FormField";
import { defaultStyles } from "@shared/styles";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
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
  const form = useForm<SignupSchema>({
    mode: "onChange",
    resolver: zodResolver(signupSchema),
  });

  const router = useRouter();

  const handleDetails = () => {
    router.push("/signup/chooseGym");
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

            <FormProvider {...form}>
              <View style={{ flex: 1, gap: 20 }}>
                <FormField
                  placeholder="Enter your username"
                  name="username"
                  label="Username"
                />
                <FormField
                  placeholder="Enter your phone number"
                  name="phone"
                  label="Phone"
                />
                <DropDown
                  data={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "noOther", label: "No Other" },
                  ]}
                  onChange={console.log}
                  placeholder="Select your gender"
                  label="Gender"
                />
                <FormField
                  placeholder="Select your birthdate"
                  name="birthdate"
                  label="Birthdate"
                />
              </View>
              <Button
                disabled={!form.formState.isValid}
                title={"Continue"}
                color={"dark100"}
                onPress={form.handleSubmit(handleDetails)}
              />
            </FormProvider>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default YourDetails;
