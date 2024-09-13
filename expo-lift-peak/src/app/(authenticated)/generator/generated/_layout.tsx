import React from 'react';
import {Stack} from "expo-router";
import {Colors, defaultStyles} from "@shared/styles";
import {Platform, SafeAreaView, Text, View} from "react-native";
import Constants from "expo-constants/src/Constants";
import CustomTopTabBar from "@shared/components/navigation/CustomTopTabBar";
import MaterialTopTabs from "@shared/components/navigation/MaterialTopTabs";
import {useGeneratedStore} from "@features/constructor/store/generatedStore";
import {formatTime} from "@shared/utils";

const Layout = () => {
    const {settings,getSetsAmount} = useGeneratedStore()
    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                headerTitle: "Generate Workout",
                headerTintColor: Colors.white,
                headerStyle: {
                    backgroundColor: Colors.dark700
                },
                header: () => (
                    <SafeAreaView style={{
                        backgroundColor: Colors.dark700,
                        paddingTop: Platform.OS === "android" ? Constants.statusBarHeight + 20 : 0,
                    }}>
                        <View style={{paddingHorizontal: 12, }}>
                            <Text style={defaultStyles.smallTitle}>
                                ~{formatTime(settings.workoutTimeInSec)}, {getSetsAmount()} sets
                            </Text>
                        </View>
                    </SafeAreaView>
                )
            }} />
            <CustomTopTabBar>
                <MaterialTopTabs.Screen name={'index'} options={{
                    title: "Targets"
                }} />
                <MaterialTopTabs.Screen name={'exercises'} options={{
                    title: "Exercises"
                }} />
            </CustomTopTabBar>
        </>
    );
};

export default Layout;