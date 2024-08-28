import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import {useToastStore} from "@shared/store";
import {Colors} from "@shared/styles";

const ToastNotification = () => {
    const { title, message, type, show, hideToast, time } = useToastStore();

    useEffect(() => {
        if (show) {
            const timeout = setTimeout(() => {
                hideToast();
            }, time);

            return () => clearTimeout(timeout);
        }
    }, [show, hideToast]);

    if (!show) return null;

    const borderColor = {
        success: Colors.success,
        error: Colors.danger,
        info: Colors.lime,
        warning: Colors.successLight, // Assuming you want to use this as a warning color
    }[type];

    return (
        <Animated.View
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={{
                top: 70,
                backgroundColor: Colors.dark500,
                width: '90%',
                position: 'absolute',
                borderRadius: 5,
                padding: 20,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                shadowColor: '#003049',
                shadowOpacity: 0.4,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
                elevation: 2,
                alignSelf: 'center',
                borderLeftWidth: 5,
                borderLeftColor: borderColor,
                zIndex: 100
            }}
        >
            <View>
                <Text style={{
                    color: Colors.white,
                    fontWeight: 'bold',
                    marginLeft: 10,
                    fontSize: 16,
                }}>{title}</Text>
                <Text style={{
                    color: Colors.white,
                    fontWeight: '500',
                    marginLeft: 10,
                    fontSize: 14,
                }}>{message}</Text>
            </View>
        </Animated.View>
    );
};

export default ToastNotification;
