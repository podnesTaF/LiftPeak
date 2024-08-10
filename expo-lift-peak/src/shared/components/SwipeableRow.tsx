import React, { Component, PropsWithChildren } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { FontAwesome } from '@expo/vector-icons';
import {Colors} from "@shared/styles"; // Assuming you're using Expo, you can use FontAwesome icons

interface SwipeableRowProps {
    onDelete?: () => void;
    onEdit?: () => void;
    actionTypes: ('edit' | 'delete' | string)[];
    backgroundColor?: string;
}

export default class SwipeableRow extends Component<PropsWithChildren<SwipeableRowProps>> {
    private renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        _dragAnimatedValue: Animated.AnimatedInterpolation<number>
    ) => {
        const { actionTypes, onEdit, onDelete, backgroundColor } = this.props;
        const actions = [];

        if (actionTypes.includes('edit') && onEdit) {
            actions.push(this.renderRightAction('edit', '#32CD32', 120, progress, onEdit, 'edit', Colors.lime));
        }

        if (actionTypes.includes('delete') && onDelete) {
            actions.push(this.renderRightAction('delete', '#dd2c00', 120, progress, onDelete, 'trash', Colors.danger));
        }

        return <View style={{ width: actions.length * 60, flexDirection: 'row', backgroundColor }}>{actions}</View>;
    };

    private renderRightAction = (
        text: string,
        color: string,
        x: number,
        progress: Animated.AnimatedInterpolation<number>,
        onPressAction: () => void,
        iconName: 'edit' | 'trash',
        iconColor: string = 'white'
    ) => {
        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [x, 0],
            extrapolate: 'clamp',
        });

        const opacity = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        const pressHandler = () => {
            this.close();
            onPressAction();
        };

        return (
            <Animated.View
                key={text}
                style={{
                    flex: 1,
                    opacity: opacity,
                    transform: [{ translateX: trans }],
                    marginHorizontal: 5,
                }}
            >
                <RectButton
                    style={[styles.rightAction]}
                    onPress={pressHandler}
                >
                    <FontAwesome name={iconName} size={24} color={iconColor} />
                </RectButton>
            </Animated.View>
        );
    };

    private swipeableRow?: Swipeable;

    private updateRef = (ref: Swipeable) => {
        this.swipeableRow = ref;
    };

    private close = () => {
        this.swipeableRow?.close();
    };

    render() {
        const { children } = this.props;
        return (
            <Swipeable
                ref={this.updateRef}
                enableTrackpadTwoFingerGesture
                friction={1}
                overshootRight={false}
                rightThreshold={40}
                renderRightActions={this.renderRightActions}
            >
                {children}
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    actionText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
        alignSelf: 'flex-start',
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
    },
});
