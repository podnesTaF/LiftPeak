import React from 'react';
import MaterialTopTabs from "@shared/components/tabs/MaterialTopTabs";
import {Colors} from "@shared/styles";
import {useHeaderHeight} from "@react-navigation/elements";

const Layout = () => {
    const headerHeight = useHeaderHeight();
    return (
        <MaterialTopTabs
            screenOptions={{
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: Colors.dark300,
                tabBarLabelStyle: {
                    fontWeight: "700",
                    textTransform: "capitalize",
                    fontSize: 14
                },
                tabBarItemStyle: {
                    backgroundColor: Colors.dark700
                },
            }}
        >
            <MaterialTopTabs.Screen name={'index'} options={{
                title: "People",
            }} />
            <MaterialTopTabs.Screen name={'groups'} options={{
                title: "Groups"
            }} />
        </MaterialTopTabs>
    );
};

export default Layout;