import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors, defaultStyles } from "@shared/styles";
import { router } from "expo-router";
import SettingsSection from "@shared/components/SettingsSection";
import { useAuthStore } from "@features/auth";

const settingsSections = [
  {
    id: "account",
    header: "Account",
    names: [
      { id: "1", name: "Profile", route: "profile" },
      { id: "2", name: "General", route: "general" },
      { id: "3", name: "Security", route: "security" },
    ],
  },
  {
    id: "workout",
    header: "Workout",
    names: [{ id: "4", name: "Units", route: "units" }],
  },
];

const Settings = () => {


  const {clearAuth} = useAuthStore()


  return (
    <View style={defaultStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {settingsSections.map((section) => (
            <SettingsSection
              key={section.id}
              header={section.header}
              data={section.names}
              parentId={section.id} 
            />
          ))}
        </View>

        <TouchableOpacity
          style={[defaultStyles.horizontalContainer, styles.button]}
          onPress={() => clearAuth()}
        >
          <Ionicons name={"log-out-outline"} size={26} color={Colors.white} />
          <Text style={defaultStyles.smallTitle}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  content: {
    flexGrow: 1,
  },
  button: {
    marginHorizontal: 20,
    backgroundColor: Colors.danger,
    padding: 12,
    borderRadius: 10,
  },
});
