import React from 'react';
import {View} from "react-native";
import Button from "@/components/shared/Button";
import {useAuthStore} from "@/store/auth";

const Logout = () => {
    const {setUser} = useAuthStore();

    const handleLogout = () => {
        setUser(null);
    }

    return (
        <View>
            <Button title={"logout"} color={"dark700"} onPress={handleLogout} />
        </View>
    );
};

export default Logout;