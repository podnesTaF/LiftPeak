import { Colors } from "@shared/styles";
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
import { useNavigation, useRouter } from "expo-router"; // Updated
import { Ionicons } from "@expo/vector-icons";
import { useToastStore } from "@shared/store";

interface Gym {
  name: string;
  place_id: string;
  formatted_address: string;
}

const GooglePlacesAPIKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const SelectGym = () => {
  const [searchResults, setSearchResults] = useState<Gym[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null); // Store selected gym object
  const [gymInput, setGymInput] = useState<string>(""); // Local state for gym input
  const { showToast } = useToastStore();
  const router = useRouter(); // Router hook for navigation
  const navigation = useNavigation();

  // Handles the "Continue" button action and navigates back to ProfileForm
  const handleGymSelection = () => {
    if (selectedGym) {
      router.replace({
        pathname: "/(authenticated)/(tabs)/personal-profile/settings/account/profile", 
        params: { gymName: selectedGym.name }, // Passing selected gym name back
      });
      showToast("Gym selected successfully", "Success", "success");
    }
  };

  // Fetches gym search results from Google Places API
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
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetches gyms when the input changes
  useEffect(() => {
    getSearchResults(gymInput);
  }, [gymInput, getSearchResults]);

  // Render function
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.resultsWrapper}>
          {renderContent(gymInput, loading, searchResults, selectedGym, setSelectedGym)}
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: selectedGym ? Colors.success : Colors.dark300, marginBottom: 100 }]} // Button color based on gym selection
        onPress={handleGymSelection}
        disabled={!selectedGym} // Disable button if no gym is selected
      >
        <Text style={[styles.buttonText, ]}>Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

// Helper function to render content based on the state
const renderContent = (
  gymInput: string | undefined,
  loading: boolean,
  searchResults: Gym[],
  selectedGym: Gym | null,
  setSelectedGym: (gym: Gym) => void
) => {
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
      keyExtractor={(item) => item.place_id}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => setSelectedGym(item)} // Set selected gym object when pressed
          style={[
            styles.itemContainer,
            selectedGym?.place_id === item.place_id && styles.selectedItemContainer, // Highlight selected item
          ]}
        >
          <View style={styles.itemContent}>
            <Text style={styles.gymName}>{item.name}</Text>
            <Text style={styles.gymAddress}>{item.formatted_address}</Text>
          </View>
        </Pressable>
      )}
    />
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
  button: {
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  textInput: {
    color: Colors.white,
    fontSize: 18,
  },
});

export default SelectGym;
