import React, {useEffect, useState} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Constants from "expo-constants";
import {Colors, defaultStyles} from "@shared/styles";
import {IUser} from "@entities/user";
import Avatar from "@shared/components/Avatar";
import {format} from "date-fns";
import Button from "@shared/components/Button";
import {useAuthStore} from "@features/auth";
import {Ionicons} from "@expo/vector-icons";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import {router, useLocalSearchParams} from "expo-router";
import {useProfileStore} from "../store";
import {BlurView} from "expo-blur";

export const ProfileHeader = ({user}: { user: IUser }) => {
    const {id} = useLocalSearchParams<{ id?: string }>()
    const {user: authUser} = useAuthStore()
    const {scrollY} = useAnimatedScroll();

    const containerStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [350, 430],
            [0, -80],
            Extrapolation.CLAMP
        );

        return {
            transform: [{translateY}],
            opacity: interpolate(
                scrollY.value,
                [200, 430],
                [1, 0],
                Extrapolation.CLAMP
            ),
        };
    });

    return (
        <>
            <Animated.View
                style={[{backgroundColor: Colors.dark900}, containerStyle]}
            >
                <View
                    style={{
                        paddingTop: Constants.statusBarHeight,
                        paddingHorizontal: 16,
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        zIndex: 100,
                        height: 220,
                    }}
                >
                    {user.profile?.wallpaperUrl ? (
                        <Image
                            source={{uri: user.profile.wallpaperUrl}}
                            style={{
                                height: 220,
                                objectFit: "cover",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                            }}
                        />
                    ) : (
                        <View
                            style={{
                                height: 220,
                                backgroundColor: Colors.dark300,
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                            }}
                        />
                    )}
                    <View style={styles.avatarContainer}>
                        <Avatar
                            size={120}
                            name={user.username[0] || ""}
                            url={user?.profile?.avatarUrl}
                        />
                    </View>
                </View>
                <View style={{padding: 16, paddingTop: 50, width: "100%", gap: 8}}>
                    <View>
                        <Text style={defaultStyles.smallTitle}>
                            {user.profile?.firstName} {user.profile?.lastName}
                        </Text>
                        <Text style={defaultStyles.secondaryText}>@{user.username}</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={{color: Colors.success, fontWeight: "500"}}>
                            link.com
                        </Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 12,
                            alignItems: 'center',
                        }}
                        >
                        <View style={{flexDirection: "row",gap:4, alignItems: "center"}}>
                            <Ionicons name="location-outline" color={Colors.dark300} size={20} />
                            <Text style={defaultStyles.secondaryText}>
                                {user.profile?.city}
                            </Text>
                        </View>
                        <View style={{flexDirection: "row",gap:4, alignItems: "center"}}>
                            <Ionicons name="people-outline" color={Colors.dark300} size={20} />
                            <Text style={defaultStyles.secondaryText}>
                                Lifters
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 12,
                            alignItems: 'center',
                            width: "100%",
                            marginBottom: 8
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => router.push({pathname: "/(authenticated)/people", params: {type: "followers", id: user.id}})}
                            style={{flexDirection: "row",gap:4, alignItems: "center"}}>
                            <Text style={{color: "white"}}>{user.followersCount}</Text>
                            <Text style={{color: Colors.dark300}}>Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push({pathname: "/(authenticated)/people", params: {type: "following", id: user.id}})}
                            style={{flexDirection: "row",gap:4,alignItems: "center"}}>
                            <Text style={{color: "white"}}>{user.followingsCount}</Text>
                            <Text style={{color: Colors.dark300}}>Followings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: "row", gap:4,alignItems: "center"}}>
                            <Text style={{color: "white"}}>0</Text>
                            <Text style={{color: Colors.dark300}}>Groups</Text>
                        </TouchableOpacity>
                    </View>
                    {!id ? (
                        <View style={[defaultStyles.row, {gap: 12}]}>
                            <Button
                                onPress={() =>
                                    router.push(
                                        "/(authenticated)/(tabs)/personal-profile/settings"
                                    )
                                }
                                style={{flex: 1, paddingVertical: 10}}
                                color={"white"}
                                title={"Settings"}
                            >
                                <Ionicons
                                    name={"settings-outline"}
                                    size={24}
                                    color={Colors.dark700}
                                />
                            </Button>
                        </View>
                    ) : user.isFollowing ? (
                        <Button fullWidth style={{
                            paddingHorizontal: 10
                        }} color={"dark500"} title={"Follow"}>
                            <Ionicons
                                name={"person-remove-outline"}
                                size={24}
                                color={Colors.white}
                            />
                        </Button>
                    ) : (
                        <Button style={{
                            paddingHorizontal: 10
                        }} fullWidth color={"white"} title={"Follow"}>
                            <Ionicons
                                name={"person-add-outline"}
                                size={24}
                                color={Colors.dark900}
                            />
                        </Button>
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
        width: 126,
        height: 126,
        borderColor: Colors.dark500,
        borderWidth: 2,
        transform: [{translateY: 73}],
    },
});
