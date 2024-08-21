import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";
import {BottomTabBarButtonProps} from "@react-navigation/bottom-tabs";
import {IUser} from "@entities/user";

interface TabBarItemProps extends Omit<BottomTabBarButtonProps, "children"> {
    label: string;
    isFocused: boolean;
    routeName: string;
    user?: IUser | null;
    userId?: number;
}

const icons: { [key: string]: React.ComponentProps<typeof Ionicons>['name']; } = {
    home: "newspaper",
    start: "barbell",
    "personal-profile": "person-outline"
}

const TabBarItem = ({isFocused, label, routeName, user, userId, ...props}: TabBarItemProps) => {

    if(routeName === "profile") {
        return null;
    }

    if (routeName === "start") {
        return <StartTabBarItem
            {...props}
            label={label}
            isFocused={isFocused}
            routeName={routeName}
        />
    }

    return (
        <TouchableOpacity
            {...props}
            style={[styles.tabBarItem, props.style]}
        >
            <Ionicons size={24} name={icons[routeName]} color={isFocused ? Colors.white : Colors.dark300}/>
            <Text style={{color: isFocused ? Colors.white : Colors.dark300}}>
                {label.toString()}
            </Text>
        </TouchableOpacity>
    );
};

const StartTabBarItem = ({isFocused, label, routeName, ...props}: TabBarItemProps) => {
    return (
        <TouchableOpacity
            {...props}
            style={[styles.tabBarItem, props.style]}
        >
            <View style={styles.startButton}>
                <Ionicons size={32} name={"play"} color={isFocused ? Colors.white : Colors.dark300}/>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    tabBarItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        zIndex: 10
    },
    startButton: {
        backgroundColor: Colors.success,
        borderRadius: 50,
        padding: 20,
        position: 'absolute',
        bottom: -20,
        shadowColor: Colors.dark900,
        shadowOffset: {
            width: 0,
            height: -5
        },
        shadowRadius: 5,
        shadowOpacity: 0.2,
    }
})

export default TabBarItem;