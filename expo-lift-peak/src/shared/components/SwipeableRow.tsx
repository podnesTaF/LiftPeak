import React, { Component, PropsWithChildren } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {FontAwesome, Ionicons} from '@expo/vector-icons';
import {Colors} from "@shared/styles";
import {start} from "node:repl";
import {Easing} from "react-native-reanimated";
import {getContrastColor} from "@shared/utils";
import {color} from "ansi-fragments"; // Assuming you're using Expo, you can use FontAwesome icons

interface SwipeableRowProps {
    onDelete?: () => void;
    onEdit?: () => void;
    onLeftAction?: () => void;
    leftActionIcon?: React.ComponentProps<typeof Ionicons>['name'];
    leftActionText?: string;
    actionTypes: ('edit' | 'delete' | string)[];
    backgroundColor?: string;
}

interface SwipeableRowState {
    iconOpacity: Animated.Value; // State for icon opacity
}

export default class SwipeableRow extends Component<PropsWithChildren<SwipeableRowProps>, SwipeableRowState> {
    private swipeableRow?: Swipeable;
    constructor(props: SwipeableRowProps) {
        super(props);
        this.state = {
            iconOpacity: new Animated.Value(1),
        };
    }

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
            onPressAction();
            this.smoothClose();
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

    private renderLeftActions = (
        progress: Animated.AnimatedInterpolation<number>,
        _dragAnimatedValue: Animated.AnimatedInterpolation<number>,
    ) => {
        const { onLeftAction, backgroundColor,leftActionIcon,leftActionText } = this.props;
        const { iconOpacity } = this.state;
        if (!onLeftAction) return null;

        const x = -100

        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [x, 0],
        });

        const opacity = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });


        return (
            <Animated.View
                style={{
                    width: 100,
                    opacity: opacity,
                    transform: [{ translateX: trans }],
                }}
            >
                <RectButton
                    style={[styles.leftAction, { backgroundColor: backgroundColor }]}
                    onPress={onLeftAction}
                >
                    {leftActionIcon && <Ionicons name={leftActionIcon} size={24} color={getContrastColor(backgroundColor)} />}
                    {leftActionText && <Text style={{color: getContrastColor(backgroundColor), fontSize: 14, fontWeight: "600"}}>
                        {leftActionText}
                    </Text>}
                </RectButton>
            </Animated.View>
        );
    };

    private updateRef = (ref: Swipeable) => {
        this.swipeableRow = ref;
    };

    private close = () => {
        this.swipeableRow?.close();
    };

    private smoothClose = () => {
        if (this.swipeableRow) {
            Animated.timing(this.swipeableRow?.state.rowTranslation, {
                toValue: 0,
                duration: 400,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    };

    private handleLeftAction = () => {
        const { onLeftAction } = this.props;
        if (onLeftAction) {
            onLeftAction();
        }
        this.smoothClose()
    };

    render() {
        const { children } = this.props;
        return (
            <Swipeable
                ref={this.updateRef}
                enableTrackpadTwoFingerGesture
                friction={1.5}
                overshootRight={false}
                overshootLeft={false}
                rightThreshold={10}
                leftThreshold={30}
                renderRightActions={this.renderRightActions}
                renderLeftActions={this.renderLeftActions}
                onSwipeableLeftWillOpen={this.handleLeftAction}
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
    leftAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
});
