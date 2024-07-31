import React, {createContext, useContext, useState} from 'react';
import { useSharedValue } from 'react-native-reanimated';

export const AnimatedScrollContext = createContext<{
    scrollY: { value: number };
}>({ scrollY: {value: 0} });

export const AnimatedScrollProvider = ({ children }: {children: React.ReactNode}) => {
    const scrollY = useSharedValue(0);

    return (
        <AnimatedScrollContext.Provider value={{ scrollY }}>
            {children}
        </AnimatedScrollContext.Provider>
    );
};

export const useAnimatedScroll = () => useContext(AnimatedScrollContext);