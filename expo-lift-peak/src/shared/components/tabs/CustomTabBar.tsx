import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "@shared/styles";
import TabItem from "@shared/components/tabs/TabItem";

interface CustomTabBarProps {
    setActiveTab: (tabName: string) => void;
    activeTab: string;
    tabs: { name: string; icon?: React.ReactNode }[];
    labelHidden?: boolean;
    style?: StyleProp<ViewStyle>;
    itemFullWidth?: boolean;
    variant?: 'default' | 'profile';
}

const CustomTabBar = ({
    setActiveTab,
    activeTab,
    tabs,
    labelHidden,
    style,
    itemFullWidth,
    variant = 'default',
}: CustomTabBarProps) => {
    return (
        <View style={[styles.tabBar, variant === 'profile' && styles.profileTabBar, style]}>
            {tabs.map((tab, index) => (
                <TabItem
                    key={index}
                    fullWidth={itemFullWidth}
                    name={tab.name}
                    icon={tab.icon}
                    label={labelHidden ? "" : tab.name}
                    activeTab={activeTab}
                    onTabPress={setActiveTab}
                    variant={variant}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: Colors.dark700,
    },
    profileTabBar: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
});

export default CustomTabBar;
