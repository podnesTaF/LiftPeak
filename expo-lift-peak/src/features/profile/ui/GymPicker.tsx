import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, {useRef} from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@shared/styles";
import { useProfileStore } from "../store";
import ProfileListItemCard from "@shared/components/ProfileListItemCard";
import { useToastStore } from "@shared/store";
import {IGym} from "@entities/gym";
import SelectGymSheet from "@features/profile/ui/SelectGymSheet";
import {useAuthStore} from "@features/auth";
import {BottomSheetModalRef} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModalProvider/types";
import {BottomSheetModal} from "@gorhom/bottom-sheet";

interface GymPickerProps {
  gyms: IGym[],
}

const GymPicker = () => {
  const { user, updateUser } = useAuthStore();
  const { showToast } = useToastStore();
  const ref = useRef<BottomSheetModal>(null)

  const handleAddGym = () => {
    if (user?.gyms && user.gyms?.length === 3) {
      showToast(
        "Gym Limit Exceeded",
        "You have reached the maximum limit of 3 gyms.",
        "error",
        4000
      );
    } else {
      ref.current?.present()
    }
  };

  const removeGym = (item: IGym) => {
    updateUser({
      gyms: user?.gyms?.filter(g => g.address !== item.address)
    })
  }

  const onAddNewGyms = (gyms: IGym[]) => {
    updateUser({gyms})
    ref?.current?.dismiss()
  }

  return (
    <View style={{ gap: 15 }}>
      <Text style={styles.label}>My Gym</Text>
      <TouchableOpacity onPress={handleAddGym} style={styles.input}>
        <Text style={styles.inputText}>Add Gym</Text>
        <Ionicons
          name="chevron-forward-sharp"
          size={20}
          color={Colors.dark300}
        />
      </TouchableOpacity>

      <View style={{ gap: 10 }}>
        {user?.gyms &&
          user.gyms.map((gym) => {
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
      <SelectGymSheet ref={ref} onSubmit={onAddNewGyms} userGyms={user?.gyms}  />
    </View>
  );
};

export default GymPicker;

const styles = StyleSheet.create({
  label: {
    color: Colors.dark300,
    fontSize: 16,
  },
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
});
