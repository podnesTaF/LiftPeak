import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { Colors, defaultStyles } from "@shared/styles";
import { Ionicons } from "@expo/vector-icons";
import Button from "@shared/components/Button";
import { router } from "expo-router";

const accountSettings = [
  {
    header: "Account",
    names: [
      {
        name: "Profile",
        route: "profile",
      },
      {
        name: "General",
        route: "general",
      },
      {
        name: "Security",
        route: "security",
      },
    ],
  },
];

const workoutSettings = [
  {
    header: "Workout",
    names: [
      {
        name: "Units",
        route: "units",
      },
    ],
  },
];

const Settings = () => {
  return (
    <View style={defaultStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.headerText}>{accountSettings[0].header}</Text>
            <View style={styles.block}>
              <FlatList
                data={accountSettings[0].names}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => (
                  <Pressable
                    style={({ pressed }) => [
                      styles.item,
                      pressed && { backgroundColor: Colors.dark500 }, 
                    ]}
                    onPress={() => (router.push(`/(authenticated)/(tabs)/personal-profile/settings/account/${item.route}`))}
                  >
                    <Text style={styles.text}>{item.name}</Text>
                    <Ionicons
                      name={"chevron-forward"}
                      size={24}
                      color={Colors.dark300}
                    />
                  </Pressable>
                )}
              />
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.headerText}>{workoutSettings[0].header}</Text>
            <View style={styles.block}>
              <FlatList
                data={workoutSettings[0].names}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => (
                  <Pressable
                    style={({ pressed }) => [
                      styles.item,
                      pressed && { backgroundColor: Colors.dark500 }, 
                    ]}
                    onPress={() => (router.push(`/(authenticated)/(tabs)/personal-profile/settings/workout/${item.route}`))}
                  >
                    <Text style={styles.text}>{item.name}</Text>
                    <Ionicons
                      name={"chevron-forward"}
                      size={24}
                      color={Colors.dark300}
                    />
                  </Pressable>
                )}
              />
            </View>
          </View>
        </View>

        <View style={styles.button}>
          <Button color={"danger"} title={"Logout"} />
        </View>
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
  button: {
    paddingHorizontal: 20,
  },
});
