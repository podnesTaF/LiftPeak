import React from 'react';
import {Dimensions, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {defaultStyles} from "@shared/styles";
import {useGeneratedStore} from "@features/constructor/store/generatedStore";
import {Body} from "@features/muscles";
import {views} from "@features/muscles/ui/Body";
import {Ionicons} from "@expo/vector-icons";

const Targets = () => {
    const {targetStats} = useGeneratedStore()
    const {height: screenHeight, width: screenWidth} = Dimensions.get('window');


    return (
        <ScrollView style={defaultStyles.container}>
           <View style={{flexDirection: "row", gap: 12}}>
               {views.map((v, index) => (
                   <Body look={v} key={index} height={screenHeight * 0.4} width={screenWidth * 0.4} selectedMuscles={targetStats.map(t => ({id: t.target.id, name: t.target.name}))} />
               ))}
           </View>
            <View>
                {targetStats.map((t, index) => (
                    <View key={t.target.id} style={[defaultStyles.row, {paddingHorizontal: 12, paddingVertical: 10}]}>
                        <View style={{gap: 8}}>
                            <Text style={defaultStyles.smallTitle}>{t.target.name}</Text>
                            <Text style={defaultStyles.secondaryText}>
                                {t.exerciseAmount} exercises
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name={"information-circle"} size={30} color={"white"} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default Targets;