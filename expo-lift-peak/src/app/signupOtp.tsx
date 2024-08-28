import Otp from "@shared/components/Otp";
import { useRouter } from "expo-router";

const signupOtp = () => {
  const router = useRouter();

  const handleOtpVerification = (otp: string) => {
    console.log("OTP Entered", otp);
    router.push("/createPassword");
  };

  return <Otp onPress={handleOtpVerification}/>;
};

export default signupOtp;
