import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import React from "react";
import { Colors } from "@shared/styles";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const General = () => {
  const form = useForm({
    mode: "onChange",
    // resolver: zodResolver(generalSettingsSchema)
  });

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
        ></ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};

export default General;

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
    marginHorizontal: 24,
    marginTop: 38,
    flex: 1,
    gap: 45,
  },
});
