import { Colors } from "@shared/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useFormContext } from "react-hook-form";
import FormField from "@shared/components/form/FormField";
import { router } from "expo-router";

interface Gym {
  name: string;
  place_id: string;
  formatted_address: string;
}

const GooglePlacesAPIKey = process.env.GOOGLE_PLACES_API_KEY;

const ChooseGym = () => {
  const [searchResults, setSearchResults] = useState<Gym[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGym, setSelectedGym] = useState<string | null>(null); 

  const { watch } = useFormContext();
  const gymInput = watch("gym");

  const getSearchResults = async (text: string) => {
    if (text) {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json`,
          {
            params: {
              query: `gym ${text}`,
              key: GooglePlacesAPIKey,
            },
          }
        );
        return response.data.results;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };


        // router.push("/(authenticated)/(tabs)/home");

  useEffect(() => {
    const fetchGyms = async () => {
      const results = await getSearchResults(gymInput || "");
      setSearchResults(results || []);
    };

    if (gymInput) {
      fetchGyms();
    } else {
      setSearchResults([]);
    }
  }, [gymInput]);

  if(selectedGym){
    router.push("/(authenticated)/(tabs)/home");

  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.inputWrapper}>
        <FormField
          name={"gym"}
          placeholder={"Choose your gym"}
          type={"name"}
          autofocus
        />
      </View>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={styles.resultsWrapper}>
          {gymInput ? (
            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.dark300} />
                <Text style={styles.loadingText}>Fetching Gyms...</Text>
              </View>
            ) : searchResults.length === 0 ? (
              <Text style={styles.noResultsText}>No Gyms Matching Search</Text>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => setSelectedGym(item.place_id)} 
                    style={[
                      styles.itemContainer,
                      selectedGym === item.place_id && styles.selectedItemContainer, 
                    ]}
                  >
                    <View style={styles.itemContent}>
                      <View>
                        <Text style={styles.gymName}>{item.name}</Text>
                        <Text style={styles.gymAddress}>{item.formatted_address}</Text>
                      </View>
                  
                    </View>
                  </Pressable>
                )}
              />
            )
          ) : (
            <Text style={styles.hintText}>Search Gyms ...</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    paddingTop: 26,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  resultsWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.dark300,
  },
  noResultsText: {
    color: Colors.danger,
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  hintText: {
    color: Colors.dark300,
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  itemContainer: {
    backgroundColor: Colors.dark500,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.dark300,
  },
  selectedItemContainer: {
    borderColor: Colors.success,
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gymName: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  gymAddress: {
    color: Colors.dark300,
    fontSize: 14,
    marginTop: 4,
  },
  checkmarkIcon: {
    marginLeft: 8,
  },
});

export default ChooseGym;
