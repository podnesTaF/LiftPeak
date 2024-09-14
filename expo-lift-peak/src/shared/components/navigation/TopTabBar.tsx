
import React from 'react';
import {View, Animated, TouchableOpacity, StyleSheet, ViewStyle, StyleProp, ScrollView} from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { Colors } from '@shared/styles';
import {BlurView} from "expo-blur";

interface CustomTopTabBarProps extends MaterialTopTabBarProps {
    containerStyle?: StyleProp<ViewStyle>
}

const TopTabBar: React.FC<CustomTopTabBarProps> = ({state, descriptors, navigation, position,containerStyle }) => {
    return (
            <BlurView intensity={10} tint={"dark"} style={[styles.tabBarContainer, containerStyle]}>
               <ScrollView horizontal contentContainerStyle={styles.scrollStyle}>
                   {state.routes.map((route, index) => {
                       const { options } = descriptors[route.key];
                       const label =
                           options.tabBarLabel !== undefined
                               ? options.tabBarLabel
                               : options.title !== undefined
                                   ? options.title
                                   : route.name;

                       const isFocused = state.index === index;

                       const onPress = () => {
                           const event = navigation.emit({
                               type: 'tabPress',
                               target: route.key,
                               canPreventDefault: true,
                           });

                           if (!isFocused && !event.defaultPrevented) {
                               navigation.navigate(route.name, route.params);
                           }
                       };

                       const onLongPress = () => {
                           navigation.emit({
                               type: 'tabLongPress',
                               target: route.key,
                           });
                       };

                       const inputRange = state.routes.map((_, i) => i);
                       const opacity = position.interpolate({
                           inputRange,
                           outputRange: inputRange.map(i => (i === index ? 1 : 0.6)),
                       });

                       return (
                           <TouchableOpacity
                               accessibilityRole="button"
                               accessibilityState={isFocused ? { selected: true } : {}}
                               accessibilityLabel={options.tabBarAccessibilityLabel}
                               testID={options.tabBarTestID}
                               onPress={onPress}
                               key={index}
                               onLongPress={onLongPress}
                               style={[styles.itemContainer, isFocused ? styles.itemContainerSelected : {}]}
                           >
                               <Animated.Text style={[styles.itemText, {opacity}]}>
                                   {label.toString()}
                               </Animated.Text>
                           </TouchableOpacity>
                       );
                   })}
               </ScrollView>
            </BlurView>
    );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        flexDirection: 'row',
        overflow: "hidden",
        zIndex: 10,
    },
    scrollStyle: {
        gap: 8,
        paddingVertical: 6,
        paddingHorizontal: 6,
        alignItems: 'center'
    },
    itemContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 100,
        backgroundColor: Colors.dark500
    },
    itemContainerSelected: {
        backgroundColor: Colors.success
    },
    itemText: {
        color: "white",
        fontWeight: '600',
        fontSize: 14
    }
})
export default TopTabBar;