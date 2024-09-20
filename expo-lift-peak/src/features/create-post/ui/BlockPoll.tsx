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
        <View style={[defaultStyles.row, {paddingVertical: 8, paddingHorizontal: 12, width: "100%"}]}>
            <View style={{gap:6}}>
                <Text style={{color: "white", fontSize: 14}}>
                    {cutString(block.poll?.question || '', 50)}
                </Text>
                <Text style={[defaultStyles.secondaryText, {fontSize: 12}]}>
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