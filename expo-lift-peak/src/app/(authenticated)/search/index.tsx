import React, {useState} from 'react';
import {FlatList, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useHeaderHeight} from "@react-navigation/elements";
import InputField from "@shared/components/form/InputField";
import {Colors} from "@shared/styles";
import {Stack, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

const RunnersSearch = () => {
    const [value, setValue] = useState("");
    const headerHeight = useHeaderHeight();
    const router = useRouter();
    return (
        <>
            
            <View style={{
                backgroundColor: Colors.dark900,
                flex: 1,
                paddingTop: headerHeight
            }}>
                {/*<View style={{padding: 12}}>*/}
                {/*    <InputField value={value} onChange={(value: string) => setValue(value)} placeholder={"Search"} />*/}
                {/*</View>*/}
                <FlatList data={[1,2,3,4,5,6,7,8]} renderItem={({item}) => <View  style={{height: 100}}>
                    <Text style={{color: "white"}}>{item}</Text>
                </View>} keyExtractor={(item) => item.toString()} />

            </View>
        </>
    );
}

export default RunnersSearch;