import { Colors } from "@shared/styles";
import axios from "axios";
import { useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Pressable,
  View,
} from "react-native";
import InputField from "./form/InputField";
import { useForm } from "react-hook-form";
import { SignupSchema } from "@features/auth/utils/signUpSchema";

interface Gym {
  name: string;
  place_id: string;
  formatted_address: string;
}

const GooglePlacesAPIKey = "AIzaSyB7Ygwv8KtiMMq0h7bPAWTAmNatjA83GEU";

const ITEM_HEIGHT = 60; // Fixed height for each item

const TabTwoScreen = () => {
  const [input, setInput] = useState<string>("");
  const [data, setData] = useState<Gym[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isListVisible, setIsListVisible] = useState<boolean>(false);

  const form = useForm<SignupSchema>({
    mode: "onChange",
  })


  const fetchGyms = async (text: string) => {
    if (text.length > 2) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json`,
          {
            params: {
              query: `gym ${text}`,
              key: GooglePlacesAPIKey,
            },
          }
        );
        setData(response.data.results);
        setIsListVisible(true); // Show the dropdown list when results are available
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setData([]);
      setIsListVisible(false); // Hide the dropdown list when input is cleared
    }
  };

  const onChangeText = async (text: string) => {
    setInput(text);
    fetchGyms(text); // Fetch gyms after setting the input
  };

  const handleSelectLocation = (location: Gym) => {
    setSelectedLocation(location.place_id);
    setInput(`${location.name}, ${location.formatted_address}`); // Set the input field with the selected gym and address
    setData([]); // Clear the dropdown list
    setIsListVisible(false); // Hide the dropdown list after selection
  };

  const handleOutsidePress = () => {
    setIsListVisible(false); // Hide the dropdown list when clicking outside
    Keyboard.dismiss(); // Dismiss the keyboard if it is open
  };

  return (
    <TouchableWithoutFeedback style={{flex: 1}} onPress={handleOutsidePress}>
      <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
          <InputField
            placeholder="Search for gyms"
            value={input}
            onChange={onChangeText}
            label={"Gym"}
          />
          {isListVisible && (
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelectLocation(item)}
                  style={styles.itemContainer}
                >
                  <Text style={styles.itemText}>{item.name}</Text>
                  <Text style={styles.itemSubText}>{item.formatted_address}</Text>
                </Pressable>
              )}
              keyExtractor={(item) => item.place_id}
              getItemLayout={(data, index) => (
                { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
              )}
              style={styles.list}
              contentContainerStyle={{ paddingBottom: 10 }}
            />
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark900,
    padding: 16,
  },
  inputContainer: {
    zIndex: 1,
    maxHeight: 350, 
  },
  list: {
    maxHeight: ITEM_HEIGHT * 5, 
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.dark700,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark500,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 16,
    color: Colors.white,
  },
  itemSubText: {
    fontSize: 12,
    color: Colors.dark300,
  },
  selectedItem: {
    backgroundColor: Colors.dark700,
  },
});

export default TabTwoScreen;
