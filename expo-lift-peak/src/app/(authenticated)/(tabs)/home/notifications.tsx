import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, Text, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {Stack} from "expo-router";
import {useHeaderHeight} from "@react-navigation/elements";
import {useQuery} from "@tanstack/react-query";
import {useAuthStore} from "@features/auth";
import {getUserNotifications} from "@entities/notifications/api/notificationApi";
import NotificationItem from "@entities/notifications/ui/NotificationItem";
import {queryClient} from "@shared/api";


const Notifications = () => {
    const [activeTab, setActiveTab] = React.useState("for-you");
    const headerHeight = useHeaderHeight()
    const {user} = useAuthStore()
    const [refreshing, setRefreshing] = useState(false);

    const {data} = useQuery({
        queryKey: ["notification", user?.id],
        queryFn: getUserNotifications,
        enabled: !!user?.id
    })

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        queryClient.invalidateQueries({
            queryKey: ["notification", user?.id]
        }).then(() => {
            setRefreshing(false);
        });
    }, [queryClient]);

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                title: "Notifications",
                headerTintColor: "white",
                headerTitle: "Notifications",
                headerLargeTitle: true,
                headerStyle: {
                    backgroundColor: Colors.dark700
                },
                headerBackTitleVisible: false
            }} />
           <ScrollView
               refreshControl={
                   <RefreshControl
                       refreshing={refreshing}
                       onRefresh={onRefresh}
                   />
               }
               style={defaultStyles.container} contentContainerStyle={{paddingTop: headerHeight + 60}}>
               <View style={{gap: 12}}>
                   {data?.map((n) => (
                      <NotificationItem item={n} key={n.id} />
                   ))}
               </View>
           </ScrollView>
        </>
    );
};

export default Notifications;