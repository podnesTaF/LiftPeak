import { Colors } from "@shared/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { Text, SafeAreaView, StyleSheet, TouchableWithoutFeedback, Keyboard, FlatList, Pressable, View } from "react-native";
import { useFormContext, useWatch } from "react-hook-form";
import FormField from "./form/FormField";

interface Gym {
  name: string;
  place_id: string;
  formatted_address: string;
}

const GooglePlacesAPIKey = "AIzaSyB7Ygwv8KtiMMq0h7bPAWTAmNatjA83GEU";

const ITEM_HEIGHT = 60; // Fixed height for each item

const LocationAutocomplete = ({ name }: { name: string }) => {
  const [data, setData] = useState<Gym[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isListVisible, setIsListVisible] = useState<boolean>(false);

  const { control, setValue } = useFormContext(); // Access form context
  const gymInput = useWatch({
    control,
    name,
  });

  useEffect(() => {
    const fetchGyms = async (text: string) => {
      if (text && text.length > 2) {
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
          setIsListVisible(true);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        setData([]);
        setIsListVisible(false);
      }
    };

    if (gymInput !== undefined) {
      fetchGyms(gymInput);
    }
  }, [gymInput]);

  const handleSelectLocation = (location: Gym) => {
    setSelectedLocation(location.place_id);
    setValue(name, `${location.name}, ${location.formatted_address}`); // Set the input field with the selected gym and address
    setData([]);
    setIsListVisible(false);
  };

  const handleOutsidePress = () => {
    setIsListVisible(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback style={{  }} onPress={handleOutsidePress}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <FormField
            placeholder="Search for gyms"
            name={name}
            label="Find your gym"
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
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark900,

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

export default LocationAutocomplete;
