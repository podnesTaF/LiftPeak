import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {Colors} from "@shared/styles";
import TabItem from "@shared/components/tabs/TabItem";

interface CustomTabBarProps {
    setActiveTab: (tabName: string) => void;
    activeTab: string;
    tabs: {name: string, icon?: React.ReactNode}[]
    labelHidden?: boolean;
    style?:  StyleProp<ViewStyle>;
    itemFullWidth?: boolean;
}

const CustomTabBar = ({setActiveTab, activeTab, tabs,labelHidden, style, itemFullWidth}: CustomTabBarProps) => {
    return (
        <View style={[styles.tabBar, style]}>
            {tabs.map((tab, index) => (
                <TabItem
                    key={index}
                    fullWidth={itemFullWidth}
                    name={tab.name}
                    icon={tab.icon}
                    label={labelHidden ? "" : tab.name}
                    activeTab={activeTab}
                    onTabPress={setActiveTab}
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
});

export default CustomTabBar;