import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Colors} from '@shared/styles';
import {Block} from '@features/create-post/model';
import {RoutineCard} from '@entities/routine';
import {ExerciseCard} from '@entities/exercise';

interface BlockMediaProps {
    block: Block;
    removeBlock: (id: string) => void;
    isRoutine?: boolean;
    isExercise?: boolean;
}

export const BlockMedia: React.FC<BlockMediaProps> = ({block, removeBlock, isRoutine = false, isExercise = false}) => {
    return (
        <View style={isRoutine || isExercise ? styles.largeMediaContainer : styles.imageContainer}>
            {isRoutine ? (
                <RoutineCard workout={JSON.parse(block.content)} addAvailable={false}/>
            ) : isExercise ? (
                <ExerciseCard exercise={JSON.parse(block.content)}/>
            ) : (
                <Image
                    alt="image"
                    source={{uri: block.content}}
                    style={styles.image}
                />
            )}
            <TouchableOpacity onPress={() => removeBlock(block.id)} style={styles.closeIcon}>
                <Ionicons name="close-outline" color="white" size={32}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: 180,
        height: 150,
        borderRadius: 16,
        marginVertical: 16,
        marginHorizontal: 8,
    },
    largeMediaContainer: {
        width: '80%',
        marginVertical: 24,
        marginHorizontal: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    closeIcon: {
        position: 'absolute',
        right: -16,
        top: -16,
        backgroundColor: Colors.dark500,
        borderRadius: 50,
        opacity: 0.6,
    },
});
