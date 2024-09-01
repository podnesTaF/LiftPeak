import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@shared/styles";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DropDownProps{
    label?: string
}

const DropDown: React.FC<DropDownProps> = ({
    label
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

  return (
    <View style={{  gap: 8 }}>
        {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.button, styles.input]}
        activeOpacity={0.8}
        onPress={toggleExpanded}
      >
        <Text style={styles.text}>Select</Text>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={Colors.dark300} />
      </TouchableOpacity>
      {expanded ? (
        <View style={styles.options}>
          <FlatList
            keyExtractor={(item) => item.value}
            data={[
              { value: "React Native1", label: "rn" },
              { value: "Swift2", label: "sw" },
            ]}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.8} style={styles.optionItem}>
                <Text style={{color: Colors.white}}>{item.value}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      ) : null}
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  optionItem: {
    minHeight: 48,
    justifyContent: "center",
  },
  separator: {
    height: 4,
  },
  options: {
    position: "absolute",
    top: 20, // Adjust as necessary
    backgroundColor: Colors.dark700,
    width: "100%",
    padding: 10,
    borderRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark500,

  },
  text: {
    opacity: 0.8,
    color: Colors.dark300,
    fontSize: 18,
  },
  button: {
    height: 50,
    justifyContent: "space-between",
    backgroundColor: Colors.dark500,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  input: {
    borderRadius: 8,
    backgroundColor: Colors.dark500,
    paddingVertical: 12,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  label: {
    color: Colors.dark300,
    fontSize: 16,
  },
});
