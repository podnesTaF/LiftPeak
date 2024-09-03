  import PasswordSetupForm from "@shared/components/PasswordSetupForm";
  import { useRouter } from "expo-router";
  import { useFormContext, useWatch } from "react-hook-form";


  const createPassword = () => {

    const router = useRouter()

    const {formState, trigger} = useFormContext();
    const passwordError = formState.errors.password1;

    const passwordValue = useWatch({
      name: "password1"
    })

    const passwordValid = !passwordError && passwordValue;

    const handlePassword = async () => {
      const isValid = await trigger("password1");

      if(isValid) {
        router.push("/signup/yourDetails")
      }
    }


    return(
      <PasswordSetupForm onPress={handlePassword} passwordValid={passwordValid}/>
    )
  };


  export default createPassword;
