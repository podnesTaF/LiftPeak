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
  TouchableOpacity,
} from "react-native";
import { useFormContext } from "react-hook-form";
import FormField from "@shared/components/form/FormField";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useToastStore } from "@shared/store";


interface Gym {
  name: string;
  place_id: string;
  formatted_address: string;
}

const GooglePlacesAPIKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const ChooseGym = () => {
  const [searchResults, setSearchResults] = useState<Gym[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGym, setSelectedGym] = useState<string | null>(null);
  const { showToast } = useToastStore();
  const { watch } = useFormContext();
  const gymInput = watch("gym");
  const navigation = useNavigation();

  // Handles the "Skip" button action and shows a toast
  const handleSignedUp = () => {
    router.push("/(authenticated)/(tabs)/home");
    showToast("User created successfully", "Success", "success");
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

  // Updates the navigation header options
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSignedUp}>
          <View style={styles.headerRightContainer}>
            <Text style={styles.headerRightText}>{selectedGym ? 'Continue' : 'Skip'}</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} style={styles.headerIcon} />
          </View>
        </TouchableOpacity>
      ),
      headerStyle: { backgroundColor: Colors.dark700 },
      headerTintColor: Colors.white,
    });
  }, [navigation]);

  // Fetches gyms when the input changes
  useEffect(() => {
    getSearchResults(gymInput || "");
  }, [gymInput, getSearchResults]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.inputWrapper}>
        <FormField
          name="gym"
          placeholder="Choose your gym"
          type="name"
          autofocus
          noValidationStyling
        />
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={styles.resultsWrapper}>
          {renderContent(gymInput, loading, searchResults, selectedGym, setSelectedGym)}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// Helper function to render content based on the state
const renderContent = (
  gymInput: string | undefined,
  loading: boolean,
  searchResults: Gym[],
  selectedGym: string | null,
  setSelectedGym: (gym: string | null) => void
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
          onPress={() => setSelectedGym(item.place_id)}
          style={[
            styles.itemContainer,
            selectedGym === item.place_id && styles.selectedItemContainer,
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
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRightText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "400",
  },
  headerIcon: {
    marginLeft: 5,
  },
});

export default ChooseGym;
