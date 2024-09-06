import React, {createContext, useContext} from 'react';
import {SharedValue, useSharedValue} from 'react-native-reanimated';

export const AnimatedScrollContext = createContext<{
    scrollY: { value: number };
}>({ scrollY: {value: 0} });

export const AnimatedScrollProvider = ({scrollY, children }: {scrollY: SharedValue<number>, children: React.ReactNode}) => {


    return (
        <AnimatedScrollContext.Provider value={{ scrollY}}>
            {children}
        </AnimatedScrollContext.Provider>
    );
};

export const useAnimatedScroll = () => useContext(AnimatedScrollContext);