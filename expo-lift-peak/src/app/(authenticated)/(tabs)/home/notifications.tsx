import React, {useCallback, useEffect, useRef, useState} from 'react';
import {RefreshControl, ScrollView, Text, View, StyleSheet, ViewToken} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {Stack} from "expo-router";
import {useHeaderHeight} from "@react-navigation/elements";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useAuthStore} from "@features/auth";
import {getUserNotifications, seenNotification} from "@entities/notifications/api/notificationApi";
import NotificationItem from "@entities/notifications/ui/NotificationItem";
import {queryClient} from "@shared/api";
import {isToday, isThisWeek, isThisMonth, subDays} from 'date-fns';
import {useNotificationStore} from "@entities/notifications";


const Notifications = () => {
    const { updateUnreadCount} = useNotificationStore()
    const [activeTab, setActiveTab] = React.useState("for-you");
    const headerHeight = useHeaderHeight()
    const {user} = useAuthStore()
    const [refreshing, setRefreshing] = useState(false);

    const {data} = useQuery({
        queryKey: ["notification", user?.id],
        queryFn: getUserNotifications,
        enabled: !!user?.id
    })

    const {mutate} = useMutation({
        mutationFn: seenNotification
    })

    useEffect(() => {
        if(data && data.some(n => !n.isRead)) {
            mutate()
            updateUnreadCount(0)
        }
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        queryClient.invalidateQueries({
            queryKey: ["notification", user?.id]
        }).then(() => {
            setRefreshing(false);
        });
    }, [queryClient]);

    const todayNotifications = data?.filter(n => isToday(new Date(n.createdAt))) || [];
    const lastWeekNotifications = data?.filter(n => isThisWeek(new Date(n.createdAt), { weekStartsOn: 1 }) && !isToday(new Date(n.createdAt))) || [];
    const lastMonthNotifications = data?.filter(n => subDays(new Date(n.createdAt), 31) && !isThisWeek(new Date(n.createdAt))) || [];

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
               style={defaultStyles.container} contentContainerStyle={{paddingTop: headerHeight + 60, paddingBottom: 120}}>
               <View style={{gap: 12}}>
                   {todayNotifications.length > 0 && (
                       <View style={{paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.dark300}}>
                           <Text style={[defaultStyles.smallTitle, {padding: 12}]}>Today</Text>
                           {todayNotifications.map((n) => (
                               <NotificationItem item={n} key={n.id} />
                           ))}
                       </View>
                   )}

                   {lastWeekNotifications.length > 0 && (
                       <>
                           <Text style={[defaultStyles.smallTitle, {padding: 12}]}>Last Week</Text>
                           {lastWeekNotifications.map((n) => (
                               <NotificationItem item={n} key={n.id} />
                           ))}
                       </>
                   )}

                   {lastMonthNotifications.length > 0 && (
                       <>
                           <Text style={[defaultStyles.smallTitle, {padding: 12}]}>Last Month</Text>
                           {lastMonthNotifications.map((n) => (
                               <NotificationItem item={n} key={n.id} />
                           ))}
                       </>
                   )}
               </View>
           </ScrollView>
        </>
    );
};

export default Notifications;