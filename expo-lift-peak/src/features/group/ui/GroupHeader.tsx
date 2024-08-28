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
                <View style={{paddingTop: Constants.statusBarHeight, paddingHorizontal: 16, justifyContent: "space-between", alignItems: "center", zIndex: 100, height: 180}}>
                    {group?.wallPictureUrl ? (
                        <Image source={{uri: group.wallPictureUrl}}
                               style={{ height: 180, objectFit: "cover", position: "absolute", top: 0, left: 0,right: 0}}/>
                    ) : (
                        <View style={{height: 180, backgroundColor: Colors.dark300, position: "absolute", top: 0, left: 0, right: 0}}/>
                    )}
                    <View style={styles.avatarContainer}>
                        <Avatar size={100} name={group.name.slice(0,1)} url={group.pictureUrl} />
                    </View>
                </View>
                <View style={{padding: 16, paddingTop: 64, backgroundColor: Colors.dark700, width: "100%", gap: 8}}>
                    <Text style={defaultStyles.smallTitle}>
                        {group.name}
                    </Text>
                    {group.groupTag && (
                        <Text style={defaultStyles.secondaryText}>
                            @{group.groupTag}
                        </Text>
                    )}
                    <View style={{flexDirection: "row", justifyContent: "space-around", width: "100%"}}>
                        <View style={{alignItems: "center"}}>
                            <Text style={defaultStyles.secondaryText}>Followers</Text>
                            <Text style={defaultStyles.smallTitle}>{group.membersCount}</Text>
                        </View>
                    </View>
                </View>
                {group.description && (
                    <View style={{paddingHorizontal: 12, paddingVertical: 20, backgroundColor: Colors.dark500}}>
                        <Text style={{color: "white", fontWeight: "500"}}>
                            {group.description}
                        </Text>
                    </View>
                )}
                <View style={{
                    paddingVertical: 10,
                    paddingHorizontal: 16
                }}>
                    {isFollowing ? (
                            <Button onPress={() => router.push("/(authenticated)/create-post")} fullWidth color={"dark500"} title={"Joined"}>
                                <Ionicons name={"person-remove-outline"} size={24} color={Colors.white} />
                            </Button>
                        ) : (
                            <Button onPress={() => router.push({pathname: "/(authenticated)/create-post", params: {groupId: group?.id}})} fullWidth color={"white"} title={"Join"}>
                                <Ionicons name={"person-add-outline"} size={24} color={Colors.dark900} />
                            </Button>
                        )
                    }
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