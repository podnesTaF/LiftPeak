import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@shared/styles";


interface ProfileListItemCardProps<T> {
    // . ProfileListItemCardProps<T>:
// This is an interface that uses the generic type T

  item: T;  // T is a generic type, so 'item' can be of any type (e.g., IGym, ISocialMediaLink)
  displayKey: string | null;  
  displayText: string;  
  onPress: (item: T) => void;  
  // A function that accepts the item of type T
}

const ProfileListItemCard = <T extends {}>({
    // T extends {}:
// This is a type constraint. It means that the generic type T should at least be an object
  item,
  displayKey,
  displayText,
  onPress,
}: ProfileListItemCardProps<T>) => {
  return (
    <View style={styles.card}>
      <View style={styles.details}>
        <Text style={styles.heading}>{displayKey}</Text>
        <Text style={styles.text}>{displayText}</Text> 
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onPress(item)} 
      >
        <Ionicons name="trash-bin-outline" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileListItemCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: Colors.dark500,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  details: {
    flex: 1,
    marginRight: 10,
  },
  heading: {
    fontSize: 16,
    color: Colors.success,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    color: Colors.white,
    marginTop: 4,
  },
  removeButton: {
    padding: 10,
  },
});
