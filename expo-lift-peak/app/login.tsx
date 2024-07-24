import React from 'react';
import {KeyboardAvoidingView, Platform, Text, TouchableOpacity, View} from "react-native";
import FormField from "@/components/FormField";
import api from "@/config/AxiosInstance";
import {useAuthStore} from "@/store/auth";
import {IUser} from "@/lib/user/model/IUser";
import {useMutation} from "@tanstack/react-query";
import {FormProvider, useForm} from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import {loginSchema, LoginUserRequest} from '@/lib/user/model/LoginSchema';
import {Link, useRouter} from "expo-router";
import {useHeaderHeight} from "@react-navigation/elements";
import {defaultStyles} from "@/constants/defaultStyles";
import Button from "@/components/shared/Button";
import {Colors} from "@/constants/Colors";

async function login(email: string, password: string) {
    const {data} = await api.post<IUser>('/auth/login', { email, password });
    return data;
}

const Login = () => {
    const headerHeight = useHeaderHeight();
    const {user, setUser} = useAuthStore()
    const router = useRouter()
    const mutation = useMutation({
        mutationFn: async (data: { email: string, password: string }) => {
            const user = await login(data.email, data.password)
            setUser(user);
            router.push('/(authenticated)/(tabs)')
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const form = useForm<LoginUserRequest>({
        mode: "onChange",
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginUserRequest) => {
        mutation.mutate(data)
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[defaultStyles.container, {paddingTop: headerHeight}]}
        >
            <View style={{flex: 1, gap: 16, paddingBottom: 40}}>
                <Text style={defaultStyles.header}>Login</Text>
                <FormProvider {...form}>
                    <View style={{paddingVertical: 16, gap: 20, flex:1}}>
                        <FormField type={"emailAddress"} name={"email"} label={"Email"} placeholder={"enter your email"} />
                        <FormField type={"password"} name={"password"} label={"Password"} placeholder={"enter your password"} />
                    </View>
                    <View style={{gap: 24}}>
                        <Button disabled={!form.formState.isValid} title={"Login"} color={"dark100"} onPress={form.handleSubmit(onSubmit)} />
                        <View style={defaultStyles.horizontalContainer}>
                            <Text style={{color:"white", fontSize: 16}}>
                                Don't have an account?
                            </Text>
                            <Link href={"/"} asChild>
                                <TouchableOpacity>
                                    <Text style={{color: Colors.lime, fontSize: 16}}>
                                        Sign up
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </FormProvider>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Login;