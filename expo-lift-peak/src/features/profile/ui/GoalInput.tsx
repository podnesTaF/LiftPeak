import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import { useProfileStore } from "../store";
import { Colors } from "@shared/styles";

const GoalInput = () => {
  const { profile,  setProfileField} = useProfileStore();

  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.label}>My Goal</Text>
      <TextInput
        multiline={true}
        maxLength={200}
        value={profile.goal}
        placeholderTextColor={Colors.dark300}
        placeholder="Tell us about your goal"
        textContentType="oneTimeCode"
        autoCapitalize="none"
        onChangeText={(text) => setProfileField("goal", text)}
        style={[
          styles.inputArea,
          {
            height: 100,
          },
        ]}
      ></TextInput>
    </View>
  );
};

export default GoalInput;

const styles = StyleSheet.create({
  inputArea: {
    borderRadius: 8,
    backgroundColor: Colors.dark500,
    color: Colors.white,
    paddingVertical: 12,
    fontSize: 18,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  label: {
    color: Colors.dark300,
    fontSize: 16,
  },
});
