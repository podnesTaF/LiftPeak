import React from 'react';
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";
import {useQuery} from "@tanstack/react-query";
import {getGroup} from "@entities/group";
import Animated, {useAnimatedScrollHandler} from "react-native-reanimated";
import {Colors, defaultStyles} from "@shared/styles";
import {GroupHeader} from "@features/group/ui/GroupHeader";
import CustomTabBar from "@shared/components/tabs/CustomTabBar";
import {MaterialIcons} from "@expo/vector-icons";
import GroupPostsFeed from "@features/group/ui/GroupPostsFeed";
import {useHeaderHeight} from "@react-navigation/elements";
import {Text, TouchableOpacity} from "react-native";


const tabs = [
    {
        name: "feed",
        icon: <MaterialIcons name={"list-alt"} size={24} color={"white"} />
    },
    {
        name: "members",
        icon: <MaterialIcons name={"groups"} size={24} color={"white"} />
    },
]

const GroupPage = () => {
    const {id} = useLocalSearchParams<{ id?: string }>()
    const [activeTab, setActiveTab] = React.useState('feed')
    const {scrollY} = useAnimatedScroll();
    const router = useRouter()

    const {data} = useQuery({
        queryKey: ['group', id],
        queryFn: () => getGroup(id),
        enabled: !!id
    })

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    return (
        <Animated.ScrollView onScroll={onScroll} contentContainerStyle={{paddingBottom: 120}}
                             style={defaultStyles.container} scrollEventThrottle={16}>
            <GroupHeader group={data} />
            <CustomTabBar labelHidden={true} itemFullWidth={true} style={{backgroundColor: Colors.dark900}} activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs}/>
            <TouchableOpacity onPress={() => router.push("/(authenticated)/create-post")} style={{paddingVertical: 20, paddingHorizontal: 12, marginTop: 12, backgroundColor: Colors.dark700}}>
                <Text style={[defaultStyles.secondaryText, {fontWeight: "600", fontSize: 16}]}>
                    How was your lift?
                </Text>
            </TouchableOpacity>
            {activeTab === "feed" && (
                <GroupPostsFeed groupId={id} />
            )}
        </Animated.ScrollView>
    );
};

export default GroupPage;