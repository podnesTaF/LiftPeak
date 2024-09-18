import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from "react-native";
import Constants from "expo-constants";
import {Colors, defaultStyles} from "@shared/styles";
import {IUser} from "@entities/user";
import Avatar from "@shared/components/Avatar";
import {format} from "date-fns";
import Button from "@shared/components/Button";
import {useAuthStore} from "@features/auth";
import {Ionicons} from "@expo/vector-icons";
import Animated, {Extrapolation, interpolate, useAnimatedStyle} from "react-native-reanimated";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import { router } from 'expo-router';

interface ProfileHeaderProps{
    user?: IUser;
}

export const ProfileHeader = ({user}: ProfileHeaderProps) => {
    const {user: authenticatedUser} = useAuthStore()
    const [isFollowing, setIsFollowing] = useState<boolean>(!!user?.isFollowing)
    // Get the scroll position (scrollY) from the custom scroll context to animate elements based on scrolling
    const {scrollY} = useAnimatedScroll();

    // Define the animated styles that will change as the user scrolls
    const containerStyle = useAnimatedStyle(() => {
        // translateY handles vertical movement based on scroll position (from 0 to -80 pixels)
        const translateY = interpolate(scrollY.value, [350, 430], [0, -80], Extrapolation.CLAMP);

        // Return the styles to be applied. This includes the translateY transformation and opacity changes.
        return {
            transform: [{translateY}], // Move the component up by -80 pixels between scrollY of 350 and 430
            opacity: interpolate(scrollY.value, [200, 430], [1, 0], Extrapolation.CLAMP) // Fade out between scrollY of 200 (fully visible) and 430 (fully invisible)
        }
    });

    if(!user) {
        return null
    }

    return (
       <>
           <Animated.View style={[{backgroundColor: Colors.dark900}, containerStyle]}>
               <View style={{paddingTop: Constants.statusBarHeight, paddingHorizontal: 16, justifyContent: "space-between", alignItems: "center", zIndex: 100, height: 180}}>
                   {user.profile?.wallpaperUrl ? (
                       <Image source={{uri: user.profile?.wallpaperUrl}}
                              style={{ height: 180, objectFit: "cover", position: "absolute", top: 0, left: 0,right: 0}}/>
                   ) : (
                       <View style={{height: 180, backgroundColor: Colors.dark300, position: "absolute", top: 0, left: 0, right: 0}}/>
                   )}
                   <View style={styles.avatarContainer}>
                       <Avatar size={100} name={user.username[0]} url={user.profile?.avatarUrl} />
                   </View>
               </View>
               <View style={{padding: 16, paddingTop: 64, backgroundColor: Colors.dark700, width: "100%", gap: 8}}>
                   <Text style={defaultStyles.smallTitle}>
                       {user.profile?.firstName} {user.profile?.lastName}
                   </Text>
                   <Text style={defaultStyles.secondaryText}>
                       @{user.username}
                   </Text>
                   <View style={{flexDirection: "row", justifyContent: "space-around", width: "100%"}}>
                       <View style={{alignItems: "center"}}>
                           <Text style={defaultStyles.secondaryText}>Followers</Text>
                           <Text style={defaultStyles.smallTitle}>{user.followersCount}</Text>
                       </View>
                       <View style={{alignItems: "center"}}>
                           <Text style={defaultStyles.secondaryText}>Followings</Text>
                           <Text style={defaultStyles.smallTitle}>{user.followingsCount}</Text>
                       </View>
                       {user.profile?.dateOfBirth && <View style={{alignItems: "center"}}>
                           <Text
                               style={defaultStyles.secondaryText}>{format(new Date(user.profile.dateOfBirth), "MM yy dd")}</Text>
                           <Text style={defaultStyles.smallTitle}>0</Text>
                       </View>}
                   </View>
               </View>
               <View style={{
                   paddingVertical: 10,
                   paddingHorizontal: 16
               }}>
                   {user.id === authenticatedUser?.id ? (
                       <View style={[defaultStyles.row, {gap: 12}]}>
                           <Button onPress={() => router.push('/(authenticated)/(tabs)/personal-profile/settings')} style={{flex: 1}} color={"dark500"} title={"Settings"}>
                               <Ionicons name={"settings-outline"} size={24} color={Colors.white} />
                           </Button>
                           <Button onPress={() => router.push('/(authenticated)/(tabs)/personal-profile/settings/account/profile')} style={{flex: 1}} color={"white"} title={"Edit Profile"}>
                               <Ionicons name={"create-outline"} size={24} color={Colors.dark900} />
                           </Button>
                       </View>
                   ) : (
                       isFollowing ? (
                           <Button fullWidth color={"dark500"} title={"Follow"}>
                               <Ionicons name={"person-remove-outline"} size={24} color={Colors.white} />
                           </Button>
                       ) : (
                           <Button fullWidth color={"white"} title={"Follow"}>
                               <Ionicons name={"person-add-outline"} size={24} color={Colors.dark900} />
                           </Button>
                       )
                   )}
               </View>
           </Animated.View>
       </>
    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        top: 20,
        borderRadius: 100,
        padding: 1,
        width: 106,
        height: 106,
        borderColor: Colors.dark500,
        borderWidth: 2,
        transform: [{translateY: 53}],
    }
})