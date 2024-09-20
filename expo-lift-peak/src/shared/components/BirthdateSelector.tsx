import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
  } from "react-native";
  import React, { useRef, useState } from "react";
  import DateTimePicker, {
    DateTimePickerEvent,
  } from "@react-native-community/datetimepicker";
  import CustomBottomSheet from "./bottomSheet/CustomBottomSheet";
  import { Ionicons } from "@expo/vector-icons";
  import { Colors } from "@shared/styles";
  import { BottomSheetModal } from "@gorhom/bottom-sheet";
  import { useProfileStore } from "@features/profile/store";
  
  interface BirthdateSelectorProps {
    label?: string;
    onSelect: (date: string) => void; 
  }
  
  const BirthdateSelector: React.FC<BirthdateSelectorProps> = ({
    label,
    onSelect,
  }) => {
    const { profile } = useProfileStore();
  
    const [tempDate, setTempDate] = useState<Date | null>(null);
    const [selectedBirthdate, setSelectedBirthdate] = useState<string | null>(
      profile?.dateOfBirth
        ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
        : null
    );
  
    const bottomSheetRef = useRef<BottomSheetModal>(null);
  
    const openBottomSheet = () => {
      const dateToSet = selectedBirthdate
        ? new Date(selectedBirthdate)
        : new Date();
      setTempDate(dateToSet);
      bottomSheetRef.current?.present();
    };
  
    const handleConfirmSelection = () => {
      if (tempDate) {
        const formattedDate = tempDate.toISOString().split("T")[0]; 
        setSelectedBirthdate(formattedDate);
        onSelect(formattedDate); 
      }
      bottomSheetRef.current?.dismiss();
    };
  
    const onDateChange = (
      event: DateTimePickerEvent,
      date?: Date | undefined
    ) => {
      if (date) {
        setTempDate(date);
      }
    };
  
    return (
      <View>
        <View style={{ gap: 8 }}>
          {label && <Text style={styles.label}>{label}</Text>}
          <TouchableOpacity onPress={openBottomSheet} style={styles.inputWrapper}>
            <Text style={{ color: Colors.dark300, fontSize: 18 }}>
              {selectedBirthdate ? selectedBirthdate : "Select your birthdate"}
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
                Select Birthdate
              </Text>
            </View>
  
            <DateTimePicker
              mode="date"
              value={tempDate || new Date()}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              style={styles.datePicker}
            />
          </View>
        </CustomBottomSheet>
      </View>
    );
  };
  
  export default BirthdateSelector;
  
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
    datePicker: {
      marginTop: 10,
    },
  });
  