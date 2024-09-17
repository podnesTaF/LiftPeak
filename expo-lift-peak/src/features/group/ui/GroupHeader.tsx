import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from "react-native";
import Constants from "expo-constants";
import {Colors, defaultStyles} from "@shared/styles";
import Avatar from "@shared/components/Avatar";
import Button from "@shared/components/Button";
import {Ionicons} from "@expo/vector-icons";
import Animated, {Extrapolation, interpolate, useAnimatedStyle} from "react-native-reanimated";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import {IGroup} from "@entities/group";
import {useRouter} from "expo-router";

interface GroupHeaderProps{
    group?: IGroup;
}

export const GroupHeader = ({group}: GroupHeaderProps) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(!!group?.isMember)
    const {scrollY} = useAnimatedScroll();
    const router = useRouter()
    const containerStyle = useAnimatedStyle(() => {
        const translateY = interpolate(scrollY.value, [350, 430], [0, -80], Extrapolation.CLAMP);

        return {
            transform: [{translateY}],
            opacity: interpolate(scrollY.value, [200, 430], [1, 0], Extrapolation.CLAMP)
        }
    })

    if(!group) {
        return null
    }

    return (
        <>
            <Animated.View style={[{backgroundColor: Colors.dark900}, containerStyle]}>
                <View style={{paddingTop: Constants.statusBarHeight, paddingHorizontal: 16, justifyContent: "space-between", alignItems: "center", zIndex: 100, height: 220}}>
                    {group?.wallPictureUrl ? (
                        <Image source={{uri: group.wallPictureUrl}}
                               style={{ height: 220, objectFit: "cover", position: "absolute", top: 0, left: 0,right: 0}}/>
                    ) : (
                        <View style={{height: 220, backgroundColor: Colors.dark300, position: "absolute", top: 0, left: 0, right: 0}}/>
                    )}
                    <View style={styles.avatarContainer}>
                        <Avatar size={80} borderRadius={12} name={group.name.slice(0,1)} url={group.pictureUrl} />
                    </View>
                </View>
                <View style={{padding: 16, paddingTop: 50, width: "100%", gap: 8, alignItems: 'center'}}>
                    <Text style={[defaultStyles.smallTitle, {textAlign: 'center', fontSize: 24}]}>
                        {group.name}
                    </Text>
                    <Text style={[defaultStyles.secondaryText, {textAlign: 'center'}]}>
                        {group.description}
                    </Text>
                    <View style={{flexDirection: "row", justifyContent: "center", width: "100%", paddingTop: 8}}>
                       <Text style={[defaultStyles.secondaryText, {fontSize: 15}]}>
                           {group.membersCount} Warriors • @{group.groupTag} • {group.location}
                       </Text>
                    </View>
                    <View style={{
                        paddingVertical: 10,
                        width: "100%",
                        flexDirection: 'row',
                        gap: 12
                    }}>
                        {isFollowing ? (
                            <Button style={{flex: 1}} onPress={() => router.push("/(authenticated)/create-post")} color={"dark500"} title={"Joined"}>
                                <Ionicons name={"person-remove-outline"} size={24} color={Colors.white} />
                            </Button>
                        ) : (
                            <Button style={{flex: 1}} onPress={() => router.push({pathname: "/(authenticated)/create-post", params: {groupId: group?.id}})} color={"white"} title={"Join"}>
                                <Ionicons name={"add-outline"} size={24} color={Colors.dark900} />
                            </Button>
                        )
                        }
                        <Button style={{flex: 1}} onPress={() => router.push("/(authenticated)/create-post")} color={"dark500"} title={"Invite"}>
                            <Ionicons name={"person-add-outline"} size={24} color={Colors.white} />
                        </Button>
                    </View>
                </View>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        top: 84,
        borderRadius: 100,
        transform: [{translateY: 40}],
    }
})