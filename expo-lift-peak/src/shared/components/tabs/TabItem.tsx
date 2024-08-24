import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from "@shared/styles";

export interface TabItemProps {
    name: string;
    label: string;
    icon?: React.ReactNode;
    activeTab?
        : string;
    onTabPress?: (tabName: string) => void;
    children?: React.ReactNode;
}

const TabItem = ({ name, label, activeTab, onTabPress, icon }: TabItemProps) => {
    const isActive = activeTab === name;

    const handlePress = () => {
        if(!onTabPress) return
        onTabPress(name);
    };

    return (
        <TouchableOpacity
            style={[styles.tabItem, isActive && styles.activeTabItem]}
            onPress={handlePress}
        >
            {icon}
            {label && <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {label}
            </Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tabItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTabItem: {
        borderBottomColor: Colors.white,
    },
    tabLabel: {
        fontWeight: '500',
        fontSize: 16,
        color: Colors.dark300,
        textTransform: 'capitalize',
    },
    activeTabLabel: {
        color: Colors.white,
    },
});

export default TabItem;
