import React from 'react';
import {Button, KeyboardAvoidingView, Platform, Text, View} from "react-native";
import FormField from "@/components/FormField";
import api from "@/config/AxiosInstance";
import {useAuthStore} from "@/store/auth";
import {IUser} from "@/lib/user/model/IUser";
import {useMutation} from "@tanstack/react-query";
import {FormProvider, useForm} from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import {loginSchema, LoginUserRequest} from '@/lib/user/model/LoginSchema';
import {useRouter} from "expo-router";

async function login(email: string, password: string) {
    const {data} = await api.post<IUser>('/auth/login', { email, password });
    return data;
}

const Login = () => {
    const {user, setUser} = useAuthStore()
    const router = useRouter()
    const mutation = useMutation({
        mutationFn: async (data: { email: string, password: string }) => {
            const user = await login(data.email, data.password)
            setUser(user);
            console.log(user)
            router.push('/home')
        },
    })

    const form = useForm<LoginUserRequest>({
        mode: "onChange",
        resolver: zodResolver(loginSchema),
    });

    console.log(form.formState.errors)

    const onSubmit = (data: LoginUserRequest) => {
        mutation.mutate(data)
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={{flex: 1}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Login</Text>
                <FormProvider {...form}>
                    <View style={{padding: 16}}>
                        <FormField name={"email"} label={"Email"} placeholder={"enter your email"} />
                        <FormField name={"password"} label={"Password"} placeholder={"enter your password"} />
                        <Button title={"Login"} onPress={form.handleSubmit(onSubmit)} />
                    </View>
                    
                </FormProvider>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Login;