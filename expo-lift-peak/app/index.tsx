import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useAssets} from "expo-asset";
import {defaultStyles} from "@/constants/defaultStyles";
import {Color} from "ansi-fragments/build/fragments/Color";
import {Colors} from "@/constants/Colors";
import Button from "@/components/shared/Button";
import {Ionicons} from "@expo/vector-icons";

const LoginCtaPage = () => {

    const [assets] = useAssets([require("@/assets/images/logo/full-logo-white.png"), require("@/assets/images/icons/flat-color-icons_google.png")]);

    return (
        <View style={[defaultStyles.container, {padding: 20}]}>
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
                    <Button color={"white"} title={"Continue with Email"} />
                </View>
                <View style={defaultStyles.horizontalContainer}>
                    <Text style={{color:"white", fontSize: 14}}>
                        Already have an account?
                    </Text>
                    <TouchableOpacity>
                        <Text style={{color: Colors.lime, fontSize: 14}}>
                            Log in
                        </Text>
                    </TouchableOpacity>
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