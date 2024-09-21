import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import CustomBottomSheet from "./bottomSheet/CustomBottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@shared/styles";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useProfileStore } from "@features/profile/store";

interface GenderSelectorProps {
  label?: string;
  onSelect: (gender: string) => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ label, onSelect }) => {
  const { profile } = useProfileStore();


  const [selectedGender, setSelectedGender] = useState<string | null>(
    profile?.gender ?? null
  );
  const [tempSelectedValue, setTempSelectedValue] = useState<string>("female");

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openBottomSheet = () => {
    setTempSelectedValue(selectedGender || "female");
    bottomSheetRef.current?.present();
  };

  const handleConfirmSelection = () => {
    if(tempSelectedValue) {
      setSelectedGender(tempSelectedValue);
      onSelect(tempSelectedValue)
    }
    bottomSheetRef.current?.dismiss();
  };

  return (
    <View>
      <View style={{ gap: 8 }}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TouchableOpacity onPress={openBottomSheet} style={styles.inputWrapper}>
          <Text style={{ color: Colors.dark300, fontSize: 18 }}>
            {selectedGender
              ? `${
                  selectedGender.charAt(0).toUpperCase() +
                  selectedGender.slice(1)
                }`
              : "Select your gender"}
          </Text>

          <Ionicons
            name={"chevron-forward-sharp"}
            size={24}
            color={Colors.dark300}
          />
        </TouchableOpacity>
      </View>

      <CustomBottomSheet
        ref={bottomSheetRef}
        handleClose={handleConfirmSelection}
        snapPoints={["43%", "90%"]}
        buttonName="Confirm"
        buttonStyle={{ opacity: 1, paddingHorizontal: 20 }}
      >
        <View>
          <View
            style={{
              borderBottomWidth: 2,
              borderColor: Colors.dark500,
              paddingBottom: 20,
            }}
          >
            <Text
              style={{
                color: Colors.dark100,
                fontSize: 20,
                fontWeight: "400",
                marginBottom: 2,
                textAlign: "center",
              }}
            >
              Gender
            </Text>
          </View>
          <Picker
            selectedValue={tempSelectedValue}
            onValueChange={(itemValue, itemIndex) =>
              setTempSelectedValue(itemValue)
            }
            style={{ color: Colors.dark100 }}
            itemStyle={{ color: Colors.dark100 }}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </CustomBottomSheet>
    </View>
  );
};

export default GenderSelector;

const styles = StyleSheet.create({
  inputWrapper: {
    borderRadius: 8,
    backgroundColor: Colors.dark500,
    color: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: Colors.dark300,
    fontSize: 16,
  },
});
