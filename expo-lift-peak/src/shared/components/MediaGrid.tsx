import React from 'react';
import {Image, View, StyleSheet, Dimensions, Text} from 'react-native';
import {IPostContent} from '@entities/post';
import {Colors, defaultStyles} from "@shared/styles";

const screenWidth = Dimensions.get('window').width;

interface MediaGridProps {
    images: IPostContent[];
}

const MediaGrid = ({images}: MediaGridProps) => {
    if (images.length === 1) {
        return (
            <View style={styles.container}>
                <Image
                    source={{uri: images[0].imageUrl}}
                    style={styles.singleImage}
                    resizeMode="cover"
                />
            </View>
        );
    } else if (images.length === 2) {
        return (
            <View style={styles.container}>
                <View style={styles.twoImagesRow}>
                    {images.map((image, index) => (
                        <View key={image.id} style={[index === 0 && {
                            borderColor: Colors.dark700,
                            borderRightWidth: 1
                        }, {height: "100%", width: "50%"}]}>
                            <Image
                                source={{uri: image.imageUrl}}
                                style={[styles.image]}
                                resizeMode="cover"
                            />
                        </View>
                    ))}
                </View>
            </View>
        );
    } else if (images.length === 3) {
        return (
            <View style={styles.container}>
                <View style={styles.gridContainer}>
                    <View style={{width: '65%', height: '100%', borderRightWidth: 1, borderRightColor: Colors.dark700}}>
                        <Image
                            source={{uri: images[0].imageUrl}}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={{width: '35%', justifyContent: 'space-between'}}>
                        <View style={{borderBottomWidth: 1, borderColor: Colors.dark700, height: "50%"}}>
                            <Image
                                source={{uri: images[1].imageUrl}}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>
                        <View style={{height: "50%"}}>
                            <Image
                                source={{uri: images[2].imageUrl}}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    } else if (images.length >= 4) {
        return (
            <View style={styles.container}>
                <View style={styles.gridContainer}>
                    <View style={{width: '75%', height: '100%', borderRightWidth: 1, borderRightColor: Colors.dark700}}>
                        <Image
                            source={{uri: images[0].imageUrl}}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={{width: '25%', justifyContent: 'space-between'}}>
                        <View style={styles.smallImage}>
                            <Image
                                source={{uri: images[1].imageUrl}}
                                resizeMode="cover"
                                style={styles.image}
                            />
                        </View>
                        <View style={{
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: Colors.dark700,
                            height: '33%',
                        }}>
                            <Image
                                source={{uri: images[2].imageUrl}}
                                resizeMode="cover"
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.smallImage}>
                            <Image
                                source={{uri: images[3].imageUrl}}
                                resizeMode="cover"
                                style={styles.image}
                            />
                            {images.length > 4 && (
                                <View style={styles.shadowContainer}>
                                   <Text style={defaultStyles.smallTitle}>
                                       +{images.length - 4}
                                   </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: screenWidth * 0.7, // Adjust height based on the screen width
    },
    gridContainer: {
        flexDirection: 'row',
        height: '100%',
    },
    singleImage: {
        width: '100%',
        height: '100%',
    },
    twoImagesRow: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
    },
    halfImage: {
        width: '50%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    smallImage: {
        width: '100%',
        height: '33%',
    },
    shadowContainer: {
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.3)",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: "center"
    }
});

export default MediaGrid;
