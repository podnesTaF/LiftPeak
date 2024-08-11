import React from 'react';
import {View} from "react-native";
import {useAuthStore} from "@features/auth";
import Button from "@shared/components/Button";
import {defaultStyles} from "@shared/styles";
import {useHeaderHeight} from "@react-navigation/elements";

const Logout = () => {
    const {setUser} = useAuthStore();
    const headerHeight = useHeaderHeight();
    const handleLogout = () => {
        setUser(null);
    }

    return (
        <View style={{paddingTop: headerHeight, flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Button title={"logout"} color={"dark700"} onPress={handleLogout} />
        </View>
    );
};

export default Logout;