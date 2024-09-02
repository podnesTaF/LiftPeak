import { Colors } from "@shared/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  View,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";
import FormField from "@shared/components/form/FormField";
import { TouchableOpacity } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@features/auth/utils/signUpSchema";

interface Gym {
  name: string;
  place_id: string;
  formatted_address: string;
}

const GooglePlacesAPIKey = "AIzaSyB7Ygwv8KtiMMq0h7bPAWTAmNatjA83GEU";

const LocationAutocomplete = ({ name }: { name: string }) => {
  const [data, setData] = useState<Gym[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(signupSchema)
  });

//   useEffect(() => {
//     const fetchGyms = async (text: string) => {
//       if (text) {
//         try {
//           const response = await axios.get(
//             `https://maps.googleapis.com/maps/api/place/textsearch/json`,
//             {
//               params: {
//                 query: `gym ${text}`,
//                 key: GooglePlacesAPIKey,
//               },
//             }
//           );
//           setData(response.data.results);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         }
//       } else {
//         setData([]);
//       }
//     };

//     if (gymInput !== undefined) {
//       fetchGyms(gymInput);
//     }
//   }, [gymInput]);

//   const handleSelectLocation = (location: Gym) => {
//     setSelectedLocation(location.place_id);
//     setValue(name, `${location.name}, ${location.formatted_address}`);
//     setData([]);
//   };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
        <FormProvider {...form}>
            <FormField 
                name={"gym"}
                placeholder={"choose your gym"}
                type={"name"}
            />
        </FormProvider>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({});

export default LocationAutocomplete;
