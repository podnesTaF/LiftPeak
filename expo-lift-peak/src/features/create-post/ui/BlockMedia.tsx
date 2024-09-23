import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Dimensions, Text} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Colors, defaultStyles} from '@shared/styles';
import {Block} from '@features/create-post/model';
import {RoutineCard} from '@entities/routine';
import {ExerciseCard} from '@entities/exercise';
import {useRouter} from "expo-router";

interface BlockMediaProps {
    block: Block;
    removeBlock: (id: string) => void;
    isRoutine?: boolean;
    isExercise?: boolean;
}

export const BlockMedia: React.FC<BlockMediaProps> = ({block, removeBlock, isRoutine = false, isExercise = false}) => {
    const router = useRouter()
    return (
        <View style={isRoutine || isExercise ? styles.largeMediaContainer : styles.imageContainer}>
            {isRoutine ? (
                <RoutineCard workout={JSON.parse(block.content)} addAvailable={false}/>
            ) : isExercise ? (
                <View style={styles.attachmentContainer}>
                    <Text style={[defaultStyles.smallTitle, {fontSize: 16}]}>
                        {JSON.parse(block.content).name}
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/(authenticated)/exercises/" + JSON.parse(block.content).id)}>
                        <Ionicons name={"information-circle-outline"} size={30} color={"white"} />
                    </TouchableOpacity>
                </View>
            ) : (
                <Image
                    alt="image"
                    source={{uri: block.content}}
                    style={styles.image}
                />
            )}
            <TouchableOpacity onPress={() => removeBlock(block.id)} style={styles.closeIcon}>
                <Ionicons name="close-outline" color="white" size={24}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: 230,
        height: 200,
        borderRadius: 16,
        marginVertical: 12,
        marginHorizontal: 8,
    },
    largeMediaContainer: {
        marginVertical: 12,
        marginLeft: 12,
        marginRight: 24,
        flex:1
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
        backgroundColor: "rgba(43,44,52, 0.6)",
        borderRadius: 50,
        padding: 4,
    },
    attachmentContainer: {
        backgroundColor: Colors.success,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        justifyContent: "space-between"
    }
});
