import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@shared/styles";
import SocialMediaPicker from "./SocialMediaPicker";
import { useProfileStore } from "../store";
import ProfileListItemCard from "@shared/components/ProfileListItemCard";

const ProfileForm = () => {
  const router = useRouter();
  const { gyms, removeGym, setGoal, goal } = useProfileStore();

  return (
    <View style={{ marginHorizontal: 24, marginTop: 38, flex: 1 }}>
      <View style={{ flex: 1, gap: 55 }}>
        <View style={{ gap: 45 }}>
          <View style={{ gap: 8 }}>
            <Text style={styles.label}>My Goal</Text>
            <TextInput
              multiline={true}
              maxLength={200}
              value={goal}
              placeholderTextColor={Colors.dark300}
              placeholder="Tell us about your goal"
              textContentType="oneTimeCode"
              autoCapitalize="none"
              onChangeText={(text) => setGoal(text)}
              style={[
                styles.inputArea,
                {
                  height: 100,
                },
              ]}
            ></TextInput>
          </View>

          <View style={{ gap: 15 }}>
            <Text style={styles.label}>My Gym</Text>

            <TouchableOpacity
              onPress={() =>
                router.push(
                  "/(authenticated)/(tabs)/personal-profile/settings/account/select-gym"
                )
              }
              style={styles.input}
            >
              <Text style={styles.inputText}>{"Add Gym"}</Text>
              <Ionicons
                name="chevron-forward-sharp"
                size={20}
                color={Colors.dark300}
              />
            </TouchableOpacity>

            <View style={{ gap: 10 }}>
              {gyms &&
                gyms?.length > 0 &&
                gyms.map((gym) => {
                  return (
                    <ProfileListItemCard
                      key={gym.address}
                      item={gym}
                      displayKey={gym.name}
                      displayText={gym.address}
                      onPress={removeGym}
                    />
                  );
                })}
            </View>
          </View>

          <View>
            <SocialMediaPicker />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileForm;

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    minHeight: 48,
    backgroundColor: Colors.dark500,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: {
    color: Colors.white,
    fontSize: 18,
  },

  inputArea: {
    borderRadius: 8,
    backgroundColor: Colors.dark500,
    color: Colors.white,
    paddingVertical: 12,
    fontSize: 18,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  label: {
    color: Colors.dark300,
    fontSize: 16,
  },
  gymsList: {
    marginTop: 20,
  },
  gymContainer: {
    backgroundColor: Colors.dark500,
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  gymName: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "bold",
  },
  gymAddress: {
    fontSize: 14,
    color: Colors.dark300,
  },
});
