import React from 'react';
import {useHeaderHeight} from "@react-navigation/elements";
import CustomTopTabBar from "@shared/components/navigation/CustomTopTabBar";
import MaterialTopTabs from "@shared/components/navigation/MaterialTopTabs";


const Layout = () => {
    const headerHeight = useHeaderHeight();
    return (
        <CustomTopTabBar>
            <MaterialTopTabs.Screen name={'index'} options={{
                title: "People",
            }} />
            <MaterialTopTabs.Screen name={'groups'} options={{
                title: "Groups"
            }} />
        </CustomTopTabBar>
    );
};

export default Layout;