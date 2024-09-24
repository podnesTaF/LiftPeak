import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@shared/styles";
import { FormProvider, useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import FormField from "@shared/components/form/formfield/FormField";
import GenderSelector from "@shared/components/GenderSelector";
import DateSelect from "@shared/components/DateSelect";
import {useNavigation, useRouter} from "expo-router";
import {zodResolver} from "@hookform/resolvers/zod";
import {UpdateGeneralSchema, updateGeneralSchema} from "@features/settings/utils/update-general.schema";
import {useAuthStore} from "@features/auth";
import {useMutation} from "@tanstack/react-query";
import {updateUserProfile} from "@features/profile";
import {IProfile} from "@entities/user";

const General = () => {
  const {user, updateProfile} = useAuthStore()
  const router = useRouter();

  const {mutate} = useMutation({
    mutationFn: (dto: UpdateGeneralSchema) => updateUserProfile(dto as Partial<IProfile>),
    onSuccess: (updatedProfile) => {
      updateProfile(updatedProfile)
      router.back()
    }
  })

  const form = useForm<UpdateGeneralSchema>({
    mode: "onChange",
    resolver: zodResolver(updateGeneralSchema),
    defaultValues: {
      firstName: user?.profile?.firstName,
      lastName: user?.profile?.lastName,
      dateOfBirth: user?.profile?.dateOfBirth,
      gender: user?.profile?.gender
    }
  });

  const navigation = useNavigation();


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={form.handleSubmit((dto) => mutate(dto))}>
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
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="lock-closed" size={20} color={Colors.white} />
            <Text style={styles.sectionHeader}>Private Information</Text>
          </View>
          <GenderSelector label="Gender" onSelect={(g) => {
            form.setValue("gender", g)
          }} value={form.getValues("gender")} />
          <DateSelect label="Birthdate" onSelect={(b) => {
            form.setValue("dateOfBirth", b)
          }} value={form.getValues("dateOfBirth")}/>
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
