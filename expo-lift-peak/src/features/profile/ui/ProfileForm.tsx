import { KeyboardAvoidingView, View } from "react-native";
import SocialMediaPicker from "./SocialMediaPicker";
import GymPicker from "./GymPicker";
import GoalInput from "./GoalInput";

const ProfileForm = () => {
  return (
    <KeyboardAvoidingView >
      <View style={{ marginHorizontal: 24, marginTop: 38, flex: 1, gap: 45 }}>
        <GoalInput />
        <GymPicker />
        <SocialMediaPicker />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileForm;
