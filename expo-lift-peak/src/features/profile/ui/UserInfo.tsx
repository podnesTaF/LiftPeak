import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import {IUser, SocialMediaPlatform} from '@entities/user';
import { useProfileStore } from '../store';

const socialMediaIcon = {
    [SocialMediaPlatform.Twitter]: "logo-twitter",
    [SocialMediaPlatform.Snapchat]: "logo-snapchat",
    [SocialMediaPlatform.Instagram]: "logo-instagram"
} as const

interface UserInfoProps {
    user: IUser;
}

export const UserInfo = ({user: {profile, gyms}}: UserInfoProps) => {

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={defaultStyles.smallTitle}>
                    My Goal
                </Text>
                {profile?.goal ? <Text style={{color: "white", fontWeight: "500"}}>
                    {profile.goal}
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
                <View style={[styles.sectionRow,  {borderBottomWidth: 1, borderBottomColor: Colors.dark300, paddingBottom: 12}]}>
                    <Ionicons name={"home-outline"} size={24} color={"white"}/>
                    <Text style={{color: "white", fontWeight: "500"}}>
                        Gyms: {gyms?.map(gym => gym.name).join(", ")}
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
                {profile?.socialMediaLinks?.map(link => (
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
