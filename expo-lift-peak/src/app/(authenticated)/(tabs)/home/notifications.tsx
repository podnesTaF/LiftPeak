import React from 'react';
import {ScrollView, Text, View} from "react-native";
import {Colors} from "@shared/styles";

const Index = () => {
    return (
        <View style={{height: 2000, flex: 1, backgroundColor: Colors.dark900}}>
            <Text style={{color: "white"}}>
                Notifications
            </Text>
        </View>
    );
};

export default Index;