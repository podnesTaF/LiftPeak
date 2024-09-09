import { Colors, defaultStyles } from "@shared/styles";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import Button from "./Button";
import { useEffect, useState } from "react";


interface OtpProps {
    onPress?: (otp: string) => void;
    onResend?: () => void;
    subTitleText?: string;
    headerText?: string;
    numberOfDigits?: number

}


const Otp: React.FC<OtpProps> = ({
    onPress = () => {},
    onResend,
    subTitleText = "Enter verification code",
    headerText = "Confirmation",
    numberOfDigits = 6
}) => {
  const [otp, setOtp] = useState("");
  const isOtpComplete = otp.length === 6;

  useEffect(() => {
    console.log(otp);
  }, [otp]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      style={[defaultStyles.container]}
    >
      <View style={{ marginTop: 38, marginHorizontal: 24 }}>
        <View>
          <Text style={[defaultStyles.header]}>{headerText}</Text>
          <Text style={[defaultStyles.smallTitle, { paddingVertical: 26 }]}>
            {subTitleText}
          </Text>
        </View>
        <View style={{ paddingBottom: 40 }}>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => {
              setOtp(text);
            }}
            focusColor={Colors.white}
            focusStickBlinkingDuration={400}
            disabled={false}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: Colors.dark500,
                width: 59,
                height: 59,
                borderRadius: 12,
                borderColor: Colors.dark500,
              },
              pinCodeTextStyle: {
                color: Colors.white,
              },
            }}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[defaultStyles.secondaryText, { fontSize: 16 }]}>
            Don't receive the code?
          </Text>
          <TouchableOpacity onPress={onResend}>
            <Text
              style={[
                defaultStyles.secondaryText,
                { fontSize: 16, color: Colors.lime },
              ]}
            >
              {" "}
              Resend
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 64 }}>
          <Button
            title={"Verify and Proceed"}
            color={"white"}
            onPress={() => onPress(otp)}
            disabled={!isOtpComplete}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Otp;
