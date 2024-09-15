import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@shared/styles";
import { router } from "expo-router";

interface SettingItem {
  id: string;
  name: string;
  route: string;
}

interface SectionProps {
  header: string;
  data: SettingItem[];
  parentId: string; 
}

const SettingsSection: React.FC<SectionProps> = ({ header, data, parentId }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{header}</Text>
      <View style={styles.block}>
        {data.map((item, index) => (
          <View key={item.id}>
            <Pressable
              style={({ pressed }) => [
                styles.item,
                pressed && { backgroundColor: Colors.dark500 },
              ]}
              onPress={() =>
                router.push(
                  `/(authenticated)/(tabs)/personal-profile/settings/${parentId}/${item.route}`
                )
              }
            >
              <Text style={styles.text}>{item.name}</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.dark300}
              />
            </Pressable>
            {index < data.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );
};

export default SettingsSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  block: {
    backgroundColor: Colors.dark700,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.dark900,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  text: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "400",
  },
  headerText: {
    fontSize: 17,
    color: Colors.dark300,
    paddingLeft: 12,
    paddingVertical: 5,
  },
});
