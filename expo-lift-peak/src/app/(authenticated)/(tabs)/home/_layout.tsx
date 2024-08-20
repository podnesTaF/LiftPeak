import React from 'react';
import {Colors} from "@shared/styles";
import CustomTopTabBar from "@shared/components/navigation/CustomTopTabBar";
import MaterialTopTabs from "@shared/components/navigation/MaterialTopTabs";

const Layout = () => {
    return (
               <CustomTopTabBar>
                   <MaterialTopTabs.Screen name={'followings'} options={{
                       title: "Followings"
                   }} />
                   <MaterialTopTabs.Screen name={'groups'} options={{
                       title: "groups"
                   }} />
                   <MaterialTopTabs.Screen name={'discover'} options={{
                       title: "discover"
                   }} />
               </CustomTopTabBar>
    );
};

export default Layout;