import React, { createContext, useContext } from 'react';
import { useSharedValue } from 'react-native-reanimated';

const AnimatedScrollContext = createContext({ scrollY: useSharedValue(0) });

export const AnimatedScrollProvider = ({ children }: {children: React.ReactNode}) => {
    const scrollY = useSharedValue(0);

    return (
        <AnimatedScrollContext.Provider value={{ scrollY }}>
            {children}
        </AnimatedScrollContext.Provider>
    );
};

export const useAnimatedScroll = () => useContext(AnimatedScrollContext);