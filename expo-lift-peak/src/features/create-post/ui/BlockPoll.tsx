import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {cutString} from "@shared/utils";
import {Ionicons} from "@expo/vector-icons";
import {PollBlock} from "@features/create-post/model";
import {useRouter} from "expo-router";
import {usePostStore} from "@features/create-post/store/postStore";

interface BlockPollProps {
    block: PollBlock;
}

const BlockPoll = ({block}: BlockPollProps) => {
    const router = useRouter();
    const {removeBlock} = usePostStore()

    return (
        <View style={[defaultStyles.row, {paddingVertical: 12, paddingHorizontal: 16, flex: 1, backgroundColor: Colors.success, margin: 12, borderRadius: 12,}]}>
            <View style={{gap:6}}>
                <Text lineBreakMode={"tail"} style={{color: "white", fontSize: 16, fontWeight: "600",}}>
                    {cutString(block.poll?.question || '', 30)}
                </Text>
                <Text style={[defaultStyles.secondaryText, {fontSize: 14, color: "white"}]}>
                    {block.poll?.isAnonymous ? "Anonymous poll" : "Open poll"} • {block.poll?.answers.length || 0} answers
                </Text>
            </View>
            <View style={{flexDirection: "row", gap: 12, alignItems: "center"}}>
                <TouchableOpacity onPress={() => router.push({pathname: "/(authenticated)/create-post/poll-editor", params: {id: block.id}})}>
                    <Ionicons name={"create-outline"} color={Colors.white} size={24}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeBlock(block.id)}>
                    <Ionicons name={"close-outline"} color={Colors.dark300} size={24}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BlockPoll;