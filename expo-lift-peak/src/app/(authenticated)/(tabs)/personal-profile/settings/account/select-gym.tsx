import { Colors, defaultStyles } from "@shared/styles";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
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
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useProfileStore } from "@features/profile/store";
import { IGym } from "@entities/gym";

interface Gym {
  name: string;
  place_id: string;
  formatted_address: string;
  longitude: number;
  latitude: number;
}

const GooglePlacesAPIKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const SelectGym = () => {
  const [searchResults, setSearchResults] = useState<IGym[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGym, setSelectedGym] = useState<IGym | null>(null);
  const [gymInput, setGymInput] = useState<string>("");
  const router = useRouter();

  const getSearchResults = useCallback(async (text: string) => {
    if (!text) {
      setSearchResults([]);
      return;
    }

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
      const mappedResults: IGym[] = response.data.results.map((gym: any) => ({
        name: gym.name,
        place_id: gym.place_id,
        address: gym.formatted_address,
        latitude: gym.geometry.location.lat,
        longtitude: gym.geometry.location.lng
      }))

      console.log(mappedResults)
      setSearchResults(mappedResults)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSearchResults(gymInput);
  }, [gymInput, getSearchResults]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[defaultStyles.container]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Choose your gym"
              value={gymInput}
              onChangeText={(text) => setGymInput(text)}
              autoFocus
              autoCorrect={false}
            />
          </View>
          <View style={styles.resultsWrapper}>
            {renderContent(
              gymInput,
              loading,
              searchResults,
              selectedGym,
              setSelectedGym
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: selectedGym ? Colors.success : Colors.dark300,
                opacity: selectedGym ? 1 : 0.5, 
              },
            ]}
            onPress={() => router.back()}
            disabled={!selectedGym}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const renderContent = (
  gymInput: string | undefined,
  loading: boolean,
  searchResults: IGym[],
  selectedGym: IGym | null,
  setSelectedGym: (gym: IGym) => void
) => {

  const {addGym} = useProfileStore()

  const handleSelectedGym = (item: IGym) => {
    setSelectedGym(item)
    addGym(item)
  }

  if (!gymInput) {
    return <Text style={styles.hintText}>Search Gyms ...</Text>;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark300} />
        <Text style={styles.loadingText}>Fetching Gyms...</Text>
      </View>
    );
  }

  if (searchResults.length === 0) {
    return <Text style={styles.noResultsText}>No Gyms Matching Search</Text>;
  }

  return (
    <FlatList
      data={searchResults}
      keyExtractor={(item) => item.address}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => handleSelectedGym(item)}
          style={[
            styles.itemContainer,
            selectedGym?.address === item.address &&
              styles.selectedItemContainer,
          ]}
        >
          <View style={styles.itemContent}>
            <Text style={styles.gymName}>{item.name}</Text>
            <Text style={styles.gymAddress}>{item.address}</Text>
          </View>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  inputWrapper: {
    paddingTop: 26,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  textInput: {
    color: Colors.white,
    fontSize: 18,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: Colors.dark500,
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  gymName: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  gymAddress: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 120, 
    shadowColor: "#000", 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SelectGym;
