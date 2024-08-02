import React from 'react';
import MaterialTopTabs from "@shared/components/tabs/MaterialTopTabs";

const Layout = () => {
    return (
        <MaterialTopTabs>
            <MaterialTopTabs.Screen name={'index'} options={{
                title: "People"
            }} />
            <MaterialTopTabs.Screen name={'groups'} options={{
                title: "Groups"
            }} />
        </MaterialTopTabs>
    );
};

export default Layout;