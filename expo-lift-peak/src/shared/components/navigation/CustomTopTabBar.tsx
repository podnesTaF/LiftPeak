import React from 'react';
import {MaterialTopTabBarProps, MaterialTopTabNavigationOptions} from "@react-navigation/material-top-tabs";
import {Colors} from "@shared/styles";
import MaterialTopTabs from "@shared/components/navigation/MaterialTopTabs";

interface CustomTopTabBarProps {
    screenOptions?: MaterialTopTabNavigationOptions
    children?: React.ReactNode
}

const CustomTopTabBar = ({screenOptions, children}: CustomTopTabBarProps) => {
    return (
        <MaterialTopTabs screenOptions={{
            tabBarStyle: {
                width: "auto",
                justifyContent: 'flex-start',
                backgroundColor: Colors.dark700,
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
            ...screenOptions,
        }}>
            {children}
        </MaterialTopTabs>
    );
};

export default CustomTopTabBar;