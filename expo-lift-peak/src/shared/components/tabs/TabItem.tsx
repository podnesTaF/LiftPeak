import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from "@shared/styles";

export interface TabItemProps {
    name: string;
    label: string;
    icon?: React.ReactNode;
    activeTab?: string;
    onTabPress?: (tabName: string) => void;
    children?: React.ReactNode;
    fullWidth?: boolean;
    variant?: 'default' | 'profile';
}

const TabItem = ({ name, label, activeTab, onTabPress, icon, fullWidth, variant = 'default' }: TabItemProps) => {
    const isActive = activeTab === name;

    const handlePress = () => {
        if (!onTabPress) return;
        onTabPress(name);
    };

    return (
        <TouchableOpacity
            style={[
                variant === 'profile' ? styles.profileTabItem : styles.tabItem,
                isActive && styles.activeTabItem,
                fullWidth && { flex: 1 },
            ]}
            onPress={handlePress}
        >
            {icon}
            {label && (
                <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tabItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: "center",
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    profileTabItem: {
        padding: 4,
        margin: 12
    },
    activeTabItem: {
        borderBottomWidth: 2,

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
