import PasswordSetupForm from "@shared/components/PasswordSetupForm";
import { useRouter } from "expo-router";


const ResetPassword = () => {

const router = useRouter();
const handleResetPassword = () => {
  router.push('/')
}

  return(
    <PasswordSetupForm isReset onPress={handleResetPassword}/>
  )

}

export default ResetPassword;
