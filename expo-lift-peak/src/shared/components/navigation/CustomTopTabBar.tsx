import React from 'react';
import {MaterialTopTabBarProps, MaterialTopTabNavigationOptions} from "@react-navigation/material-top-tabs";
import {Colors} from "@shared/styles";
import MaterialTopTabs from "@shared/components/navigation/MaterialTopTabs";
import {StyleSheet, View} from 'react-native'

interface CustomTopTabBarProps {
    screenOptions?: MaterialTopTabNavigationOptions
    children?: React.ReactNode
    paddingTop?: number;
    absolute?: boolean;
}

const CustomTopTabBar = ({screenOptions,absolute,paddingTop, children}: CustomTopTabBarProps) => {
    return (
            <MaterialTopTabs screenOptions={{
                tabBarStyle: {
                    width: "100%",
                    marginTop: paddingTop,
                    position:absolute ? "absolute" : "relative",
                    justifyContent: 'flex-start',
                    backgroundColor: absolute ? "rgba(15,16,20, 0.7)" : Colors.dark700,
                },
                tabBarItemStyle: {
                    width: "auto",
                },
                tabBarIndicatorStyle: {
                    backgroundColor: Colors.white,
                    height: 3,
                },
                tabBarLabelStyle: {
                    fontWeight: '500',
                    fontSize: 16,
                    textTransform: 'capitalize',
                },
                tabBarScrollEnabled: true,
                tabBarActiveTintColor: Colors.white,
                tabBarInactiveTintColor: Colors.dark300,
            }}>
                {children}
            </MaterialTopTabs>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
});

export default CustomTopTabBar;