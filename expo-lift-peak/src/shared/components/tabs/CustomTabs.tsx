import React, { useState, ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from "@shared/styles";
import TabItem, { TabItemProps } from './TabItem';

interface CustomTabsProps {
    initialTab?: string;
    children: ReactElement<TabItemProps>;  // Ensures children are of type TabItem
}

const CustomTabs = ({ initialTab, children}: CustomTabsProps) => {
    const [activeTab, setActiveTab] = useState(initialTab || '');

    const handleTabPress = (tabName: string) => {
        setActiveTab(tabName);
    };

    // Clone children and pass activeTab and handleTabPress to each TabItem
    const clonedChildren = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                activeTab,
                onTabPress: handleTabPress,
            });
        }
        return child;
    });

    const renderTabBar = () => (
        <View style={styles.tabBar}>
            {clonedChildren}
        </View>
    );

    const renderContent = () => (
        React.Children.map(children, child => {
            if (React.isValidElement(child) && child.props.name === activeTab) {
                return child.props.children;
            }
            return null;
        })
    );

    return (
        <>
            {renderTabBar()}
            <View style={styles.content}>
                {renderContent()}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: Colors.dark700,
    },
    content: {
        flex: 1,
        backgroundColor: Colors.dark900,
    },
});

export default CustomTabs;
