import { SignupSchema, signupSchema } from "@features/auth/utils/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import DropDown from "@shared/components/DropDown";
import FormField from "@shared/components/form/FormField";
import LocationAutocomplete from "@shared/components/LocationAutocomplete";
import { defaultStyles } from "@shared/styles";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

const yourDetails = () => {
  const form = useForm<SignupSchema>({
    mode: "onChange",
    resolver: zodResolver(signupSchema),
  });

  return (
    <View style={[defaultStyles.container]}>
      <View style={{ marginHorizontal: 24, marginTop: 38, flex: 1 }}>
        <View style={{ paddingBottom: 40 }}>
          <Text style={defaultStyles.header}>Your Details</Text>
        </View>

        <FormProvider {...form}>
          <View style={{ flex: 1, gap: 22 }}>
            <FormField
              placeholder="Search for gyms"
              name="username"
              label="Username"
            ></FormField>

            <LocationAutocomplete name="gym" />
            <DropDown label="Gender"/>
            <FormField
              placeholder="Select your birthdate"
              name="birthdate"
              label="Birthdate"
            />
          </View>
        </FormProvider>
      </View>
    </View>
  );
};

export default yourDetails;
