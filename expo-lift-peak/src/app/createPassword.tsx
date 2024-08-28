import PasswordSetupForm from "@shared/components/PasswordSetupForm";
import { useRouter } from "expo-router";


const createPassword = () => {

  const router = useRouter()

  const handleCreatePassword = () => {
    router.push('/yourDetails')
  }


  return(
    <PasswordSetupForm onPress={handleCreatePassword} />
  )
};


export default createPassword;
