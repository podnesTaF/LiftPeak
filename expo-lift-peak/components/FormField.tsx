import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {TextInput, StyleSheet, Text} from "react-native";

interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  placeholder,
    type
}) => {
  const { control, formState: { errors } } = useFormContext();

  return (
      <>
        <Controller
            control={control}
            render={({ field }) => (
                <TextInput
                    textContentType={'emailAddress'}
                    autoCapitalize="none"
                    {...field}
                    style={styles.input}
                    placeholder={placeholder}
                />
            )}
            name={name}
            rules={{ required: 'You must enter your name' }}
        />
        {errors.name && <Text style={styles.errorText}>{(errors?.[name] as any)?.message}</Text>}
      </>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});


export default FormField;
