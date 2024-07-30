import React from 'react';
import MaterialTopTabs from "@shared/components/tabs/MaterialTopTabs";
import {Colors} from "@shared/styles";

const Layout = () => {
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
        }}>
            <MaterialTopTabs.Screen name={'followings'} options={{
                title: "Followings"
            }} />
            <MaterialTopTabs.Screen name={'groups'} options={{
                title: "groups"
            }} />
            <MaterialTopTabs.Screen name={'discover'} options={{
                title: "discover"
            }} />
        </MaterialTopTabs>
    );
};

export default Layout;