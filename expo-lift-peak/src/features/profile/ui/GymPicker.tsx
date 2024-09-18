import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@shared/styles";
import { useProfileStore } from "../store";
import ProfileListItemCard from "@shared/components/ProfileListItemCard";
import { useToastStore } from "@shared/store";

const GymPicker = () => {
  const { gyms, removeGym } = useProfileStore();
  const { showToast } = useToastStore();

  const handleAddGym = () => {
    if (gyms && gyms?.length === 3) {
      showToast(
        "Gym Limit Exceeded",
        "You have reached the maximum limit of 3 gyms.",
        "error",
        4000
      );
    } else {
      router.push(
        "/(authenticated)/(tabs)/personal-profile/settings/account/select-gym"
      );
    }
  };

  return (
    <View style={{ gap: 15 }}>
      <Text style={styles.label}>My Gym</Text>

      <TouchableOpacity onPress={handleAddGym} style={styles.input}>
        <Text style={styles.inputText}>Add Gym</Text>
        <Ionicons
          name="chevron-forward-sharp"
          size={20}
          color={Colors.dark300}
        />
      </TouchableOpacity>

      <View style={{ gap: 10 }}>
        {gyms &&
          gyms?.length > 0 &&
          gyms.map((gym) => {
            return (
              <ProfileListItemCard
                key={gym.address}
                item={gym}
                displayKey={gym.name}
                displayText={gym.address}
                onPress={removeGym}
              />
            );
          })}
      </View>
    </View>
  );
};

export default GymPicker;

const styles = StyleSheet.create({
  label: {
    color: Colors.dark300,
    fontSize: 16,
  },
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
});
