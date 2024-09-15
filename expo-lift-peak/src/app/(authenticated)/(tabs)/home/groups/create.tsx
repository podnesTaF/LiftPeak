import React from 'react';
import {Stack} from "expo-router";
import Button from "@shared/components/Button";
import {ScrollView} from "react-native";

const Create = () => {
    return (
        <>
         <Stack.Screen options={{
             headerBackTitleVisible: false,
             title: "Quick Start",
             headerRight: () => (
                 <Button color={"success"} title={"Create"} />
             )
         }} />
            <ScrollView contentContainerStyle={{padding: 12}}>

            </ScrollView>
        </>
    );
};

export default Create;