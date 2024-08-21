import React from 'react';
import {StyleSheet, View} from "react-native";
import {Colors} from "@shared/styles";
import TabItem from "@shared/components/tabs/TabItem";

interface CustomTabBarProps {
    setActiveTab: (tabName: string) => void;
    activeTab: string;
    tabs: string[]
}

const CustomTabBar = ({setActiveTab, activeTab, tabs}: CustomTabBarProps) => {
    return (
        <View style={styles.tabBar}>
            {tabs.map((tab, index) => (
                <TabItem
                    key={index}
                    name={tab}
                    label={tab}
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