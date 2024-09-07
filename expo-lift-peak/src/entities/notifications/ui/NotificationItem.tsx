    import React from 'react';
    import {Image, Text, TouchableOpacity, View, StyleSheet} from "react-native";
    import {INotification} from "@entities/notifications";
    import Avatar from "@shared/components/Avatar";
    import {Colors, defaultStyles} from "@shared/styles";
    import {getActionByType} from "@entities/notifications/utils/getActionByType";
    import {formatDistanceToNow} from "date-fns";
    import Button from "@shared/components/Button";
    import {useRouter} from "expo-router";
    import {Ionicons} from "@expo/vector-icons";

    interface NotificationItemProps {
        item: INotification;
    }

    const NotificationItem = ({item}: NotificationItemProps) => {
        const router = useRouter();
        return (
            <TouchableOpacity style={{flexDirection: "row", alignItems: "center", padding: 12, gap: 16, justifyContent: "space-between"}}>
                <TouchableOpacity
                    onPress={() => router.push({pathname:"/(authenticated)/(tabs)/home/profile", params: {id: item.senderId}})}
                    style={{
                    flexDirection: 'row',
                    alignItems: "center",
                    gap: 10,
                    flex: 1
                }}>
                    <Avatar size={56} url={item.sender.profile?.avatarUrl} name={item.sender.profile?.firstName[0] + "" + item.sender.profile?.lastName[0]}/>
                    <View style={{gap: 8, flexShrink: 1}}>
                        <Text style={[defaultStyles.smallTitle]}>
                            {item.sender.username} <Text style={{fontWeight: "400"}}>{getActionByType(item.type)}</Text> <Text style={defaultStyles.secondaryText}>
                            {" " + formatDistanceToNow(new Date(item.createdAt), {addSuffix: true}).replace("minute", "min")}
                        </Text>
                        </Text>
                    </View>
                </TouchableOpacity>
                {item.type === "follow" && (
                    item.isFollowing ?
                            <Button color={"white"} style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                    }} title={"Follow"} /> : (
                        <Button color={"white"} style={{
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                        }} title={"Following"} />
                    ))
                }
                {item.type === "like" && (
                    <TouchableOpacity onPress={() => router.push({pathname: "/(authenticated)/workout-details", params: {workoutId: item.workoutId}})}>
                        {item.workout?.mediaContents?.[0].mediaUrl ? <Image style={styles.post} source={{
                            uri: item.workout?.mediaContents?.[0].mediaUrl
                        }} /> : (
                            <View style={styles.post}>
                                <Ionicons name={"barbell"} color={Colors.dark300} size={30} />
                            </View>
                        )}
                    </TouchableOpacity>
                )}
                {item.type === "group_like" && (
                    <TouchableOpacity onPress={() => router.push({pathname: "/(authenticated)/workout-details", params: {workoutId: item.postId}})}>
                        {item.workout?.mediaContents?.[0].mediaUrl ? <Image style={styles.post} source={{
                            uri: item.post?.contents?.[0].imageUrl
                        }} /> : (
                            <View style={styles.post}>
                                <Ionicons name={"barbell"} color={Colors.dark300} size={30} />
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    const styles  = StyleSheet.create({
        post: {width: 70, height: 70, borderRadius: 12, backgroundColor: Colors.dark700, alignItems: 'center', justifyContent: "center"}
    })

    export default NotificationItem;