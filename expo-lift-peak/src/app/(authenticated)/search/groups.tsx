import React, {useState} from 'react';
import {Text, View} from "react-native";
import {Colors} from "@shared/styles";
import InputField from "@shared/components/form/InputField";

const GroupSearch = () => {
    const [value, setValue] = useState("");
    return (
        <View style={{
            backgroundColor: Colors.dark900,
            flex: 1,
            paddingTop: 12
        }}>
            <View style={{padding: 12}}>
                <InputField value={value} onChange={(value: string) => setValue(value)} placeholder={"Search"} />
            </View>
        </View>
    );
};

export default GroupSearch;