import Otp from "@shared/components/Otp";
import { useRouter } from "expo-router";


const passwordOtp = () => {

  const router = useRouter();

  const handleOtpVerification = (otp: string) => {
    console.log("OTP Entered", otp)
    router.push('/resetPassword')

  }


  return (
    <Otp onPress={handleOtpVerification} />
  );
};

export default passwordOtp

