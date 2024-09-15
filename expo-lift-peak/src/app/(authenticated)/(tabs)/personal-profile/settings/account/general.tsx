import { View, Text } from "react-native";
import React from "react";
import FormField from "@shared/components/form/FormField";
import Dropdown from "@shared/components/DropDown";

const General = () => {
  return (
    <View>
      <FormField
        name="firstName"
        placeholder=""
        label="First name"
        noValidationStyling
      />
      <FormField
        name="lastName"
        placeholder=""
        label="Last name"
        noValidationStyling
      />
      <FormField
        placeholder="Select your birthdate"
        name="birthdate"
        label="Birthdate"
        type="date"
        noValidationStyling
      />
      <Dropdown
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
    </View>
  );
};

export default General;
