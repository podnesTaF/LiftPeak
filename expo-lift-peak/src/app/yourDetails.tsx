import LocationAutocomplete from "@shared/components/LocationAutocomplete";
import { defaultStyles } from "@shared/styles";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

const yourDetails = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[defaultStyles.container]}
    >
      <View style={{ marginHorizontal: 24, marginTop: 38, flex: 1}}>
        <View style={{ paddingBottom: 40 }}>
          <Text style={defaultStyles.header}>Your Details</Text>
        </View>
        <View style={{flex: 1}}>
            <LocationAutocomplete />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default yourDetails;
