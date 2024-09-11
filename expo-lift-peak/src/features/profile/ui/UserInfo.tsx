import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import {IUser, SocialMediaPlatform} from '@entities/user';

const socialMediaIcon = {
    [SocialMediaPlatform.Twitter]: "logo-twitter",
    [SocialMediaPlatform.Facebook]: "logo-facebook",
    [SocialMediaPlatform.Instagram]: "logo-instagram"
} as const

interface UserInfoProps {
    user: IUser;
}

export const UserInfo = ({user}: UserInfoProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={defaultStyles.smallTitle}>
                    My Goal
                </Text>
                {user?.profile?.goal ? <Text style={{color: "white", fontWeight: "500"}}>
                    {user?.profile?.goal}
                </Text> : (
                    <Text style={{color: Colors.dark300, fontWeight: "500"}}>
                        No Goal Specified
                    </Text>
                )}
            </View>
            <View style={styles.section}>
                <Text style={defaultStyles.smallTitle}>
                    Location
                </Text>
                <View style={styles.sectionRow}>
                    <Ionicons name={"location-outline"} size={24} color={"white"}/>
                    <Text style={{color: "white", fontWeight: "500"}}>
                        {user?.profile?.country}, {user?.profile?.city}
                    </Text>
                </View>
                <View style={[styles.sectionRow,  {borderBottomWidth: 1, borderBottomColor: Colors.dark300, paddingBottom: 12}]}>
                    <Ionicons name={"home-outline"} size={24} color={"white"}/>
                    <Text style={{color: "white", fontWeight: "500"}}>
                        Gyms: {user?.gyms?.map(gym => gym.name).join(", ")}
                    </Text>
                </View>
                <TouchableOpacity>
                    <Text style={{color: Colors.success, fontWeight: "500"}}>
                        Open In Maps
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.section]}>
                <Text style={defaultStyles.smallTitle}>
                    Social Media
                </Text>
                {user?.profile?.socialMediaLinks?.map(link => (
                    <View key={link.id} style={styles.sectionRow}>
                        <Ionicons name={socialMediaIcon[link.platform]} size={24} color={"white"}/>
                        <TouchableOpacity>
                            <Text style={{color: Colors.success, fontWeight: "500"}}>
                                {link.url.replace("https://", "").replace("http://", "")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 32,
        backgroundColor: Colors.dark700,
        marginTop: 12,
        gap: 24,
        width: "100%",
    },
    section: {
        gap: 12
    },
    sectionRow: {flexDirection: "row", gap: 10, alignItems: "center"}
})
