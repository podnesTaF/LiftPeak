import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useAssets} from "expo-asset";
import {Ionicons} from "@expo/vector-icons";
import {Link, useRouter} from "expo-router";
import {Colors, defaultStyles} from "@shared/styles";
import Button from "@shared/components/Button";

const LoginCtaPage = () => {

    const [assets] = useAssets([require("@assets/images/logo/full-logo-white.png"), require("@assets/images/icons/flat-color-icons_google.png")]);

    const router = useRouter();

    const handleSignUp = () => {
        router.push("/signup")
    }


    return (
        <View style={[defaultStyles.container, {paddingHorizontal: 20, paddingBottom: 40}]}>
            <View style={styles.container}>
                {assets && (
                    <Image
                        style={styles.logo}
                        source={{uri: assets[0].uri}}
                    />
                )}
            </View>
            <View style={{gap:16, paddingBottom: 2}}>
                <View style={{gap: 12}}>
                    <Button color={'white'} fullWidth={true} title={"Continue with Google"}>
                        {assets && <Image source={{uri: assets[1].uri}} style={{width: 24, height: 24}} />}
                    </Button>
                    <Button color={'dark500'} fullWidth={true} title={"Continue with Apple"}>
                        <Ionicons name={"logo-apple"} style={{fontSize: 24, color: "white"}} />
                    </Button>
                </View>
                <View style={defaultStyles.horizontalContainer}>
                    <View style={{
                        flex: 1,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: Colors.dark100,
                    }} />
                    <Text style={{fontSize: 14, color: Colors.dark100}}>
                        or
                    </Text>
                    <View style={{
                        flex: 1,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: Colors.dark100,
                    }} />
                </View>
                <View>
                    <Button color={"white"} title={"Sign up with email"} onPress={handleSignUp}/>
                </View>
                <View style={defaultStyles.horizontalContainer}>
                    <Text style={{color:"white", fontSize: 16}}>
                        Already have an account?
                    </Text>
                    <Link href={"/login"} asChild>
                        <TouchableOpacity>
                            <Text style={{color: Colors.lime, fontSize: 16}}>
                                Log in
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    logo: {
        width: "100%",
        objectFit: "contain",
        height: "100%"
    },

})

export default LoginCtaPage;