import React from 'react';
import {Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {defaultStyles} from "@shared/styles";
import Button from "@shared/components/Button";
import {useRouter} from "expo-router";

const CreateGroupPlaceholder = () => {
    const router = useRouter()
    return (
        <View style={{paddingVertical: 16, gap: 16, alignItems: 'center'}}>
            <View style={{gap: 10, alignItems: "center"}}>
                <Ionicons name={"people-outline"} size={36} color={"white"} />
                <Text style={defaultStyles.smallTitle}>
                    Create a Group
                </Text>
            </View>
            <Text style={[defaultStyles.secondaryText,{paddingHorizontal: 24, textAlign: 'center'}]}>
                Create your group and connect people to achieve new goals with LiftPeak
            </Text>
            <Button onPress={() => router.push("/(authenticated)/(tabs)/home/groups/create")} fullWidth color={"dark500"} title={"Create"}>
                <Ionicons name={"add"} size={24} color={"white"} />
            </Button>
        </View>
    );
};

export default CreateGroupPlaceholder;