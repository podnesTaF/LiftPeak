import React from 'react';
import MaterialTopTabs from "@shared/components/tabs/MaterialTopTabs";
import {Colors} from "@shared/styles";
import CustomTopTabBar from "@shared/components/tabs/CustomTopTabBar";

const Layout = () => {
    return (
           <MaterialTopTabs
               tabBar={(props) =>  <CustomTopTabBar {...props} />}>
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