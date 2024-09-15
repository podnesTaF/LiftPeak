import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import FormField from "@shared/components/form/FormField";
import { Colors, defaultStyles } from "@shared/styles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter} from "expo-router"; // Using useSearchParams to receive gym data
import SocialMediaPicker from "./SocialMediaPicker";

const ProfileForm = () => {
  const [gymName, setGymName] = useState<string>(""); // Local state to store selected gym
  const router = useRouter();
  const params = useLocalSearchParams(); // Hook to retrieve params from SelectGym

  useEffect(() => {
    if (params?.gymName) {
      setGymName(params.gymName as string); // Update gymName state when param changes
    }
  }, [params]);

  return (
    <View style={{ marginHorizontal: 24, marginTop: 38, flex: 1 }}>
      <View style={{ flex: 1, gap: 20 }}>
        <View style={{ gap: 8 }}>
          <Text style={styles.label}>My Gym</Text>
          <TouchableOpacity onPress={() => router.push('/(authenticated)/(tabs)/personal-profile/settings/account/select-gym')} style={styles.input}>
            <Text style={styles.inputText}>
              {gymName ? gymName : 'Select Gym'} {/* Display selected gym name */}
            </Text>
            <Ionicons
              name="chevron-forward-sharp"
              size={20}
              color={Colors.dark300}
            />
          </TouchableOpacity>
        </View>
        <FormField
          name="goal"
          placeholder=""
          label="My goal"
          noValidationStyling
          numberOfLines={2}
          type="textarea"
        />
        <SocialMediaPicker />
      </View>
    </View>
  );
};

export default ProfileForm;

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    minHeight: 48,
    backgroundColor: Colors.dark500,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: {
    color: Colors.white,
    fontSize: 18,
  },
  label: {
    color: Colors.dark300,
    fontSize: 16,
  },
});
