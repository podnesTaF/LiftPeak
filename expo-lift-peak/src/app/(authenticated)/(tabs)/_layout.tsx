import React from 'react';
import {Tabs} from 'expo-router';
import {Colors} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import {View} from "react-native";

function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
}) {
    return <Ionicons name={props.name} size={24} color={props.color} />;
}

export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: Colors.dark300,
                tabBarStyle: {
                    backgroundColor: Colors.dark700,
                    borderTopWidth: 0,
                }
            }}>
            <Tabs.Screen name={"home"} options={{
                headerShown: true,
                headerShadowVisible: false,
                title: "Feed",
                tabBarIcon: (props) => <TabBarIcon name="newspaper" color={props.color} />,
                headerStyle: {
                    backgroundColor: Colors.dark700
                },
                headerTintColor: "#fff",
                header: ({navigation, options}) => (
                    <View style={{flexDirection: "row", paddingVertical: 8, paddingHorizontal: 12, justifyContent: "space-between"}}>
                        
                    </View>
                )
            }}/>
            <Tabs.Screen name={"logout"} options={{
                title: "Start",
                tabBarIcon: (props) => <Ionicons size={36} name="add" color={props.color} />
            }} />
            <Tabs.Screen name={"two"} options={{
                title: "workouts",
                tabBarIcon: (props) => <TabBarIcon name="barbell" color={props.color} />,
            }} />
        </Tabs>
    );
}
