import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    TextInput,
    Button,
    ScrollView,
    Image,
    TouchableOpacity,
    Text,
    Alert,
    StyleSheet,
    KeyboardAvoidingView, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {v4 as uuidv4} from 'uuid';
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import PostAttachments from "@features/create-post/ui/PostAttachments";
import {RoutineCard} from "@entities/routine";
import {ExerciseCard} from "@entities/exercise";

export function CreatePost() {
    const [blocks, setBlocks] = useState<Block[]>([
        {id: uuidv4(), type: 'title', content: ''},
    ]);
    const [focusedInputIdx, setFocusedInputIdx] = useState<number | null>(null);
    const scrollRef = useRef<ScrollView | null>(null);
    const inputRefs = useRef<Record<string, TextInput | null>>({});

    const addBlock = (type: BlockType = 'text', insertAt: number | null = null, content?: string) => {
        const newBlock: Block = {
            id: uuidv4(),
            type,
            content: content || '',
        };
        if (insertAt === null) {
            setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
            setFocusedInputIdx(null)
        } else {
            setBlocks((prevBlocks) => [
                ...prevBlocks.slice(0, insertAt + 1),
                newBlock,
                ...prevBlocks.slice(insertAt + 1),
            ]);
            if(type === 'text') {
                setFocusedInputIdx(insertAt + 1);
            }
        }
        setTimeout(() => {
            if (type === 'text') {
                inputRefs.current[newBlock.id]?.focus();
            }
        }, 0);

        setTimeout(() => {
            scrollRef.current?.scrollToEnd();
        }, 200)
    };

    const updateBlockContent = (id: string, content: string) => {
        setBlocks((prevBlocks) =>
            prevBlocks.map((block) =>
                block.id === id ? {...block, content} : block
            )
        );
    };

    const changeBlockType = (id: string, type: BlockType) => {
        setBlocks((prevBlocks) =>
            prevBlocks.map((block) =>
                block.id === id ? {...block, type} : block
            )
        );
    };

    const insertImage = async (id: string) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            changeBlockType(id, 'image');
            updateBlockContent(id, result.assets[0].uri);
        }
    };

    const removeBlock = (id: string ) => {
        setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== id));
        if(focusedInputIdx !== null) {
            setFocusedInputIdx(null);
        }
    }

    const handlePostCreation = () => {
        console.log('Post created:', blocks);
    };

    const handleBackspacePress = (block: Block, index: number) => {
        if (block.content === '' && blocks.length > 1) {
            const previousBlockId = blocks[index - 1]?.id;
            inputRefs.current[previousBlockId]?.focus();

            setBlocks((prevBlocks) => [
                ...prevBlocks.slice(0, index),
                ...prevBlocks.slice(index + 1),
            ]);
        }
    };

    const renderOptionsMenu = (blockId: string) => {
        Alert.alert(
            'Select Block Type',
            '',
            [
                {text: 'Title', onPress: () => changeBlockType(blockId, 'title')},
                {text: 'Subtitle', onPress: () => changeBlockType(blockId, 'subtitle')},
                {text: 'Text', onPress: () => changeBlockType(blockId, 'text')},
                {text: "Remove Block", onPress: removeBlock.bind(null, blockId), style: 'destructive'},
                {text: 'Cancel', style: 'cancel'},
            ],
            {cancelable: true}
        );
    };

    useEffect(() => {
        console.log("Block", focusedInputIdx)
    }, [focusedInputIdx]);

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 80}
            behavior={
            Platform.OS === 'ios' ? 'padding' : 'height'
        } style={[defaultStyles.container]}>
            <ScrollView
                    ref={scrollRef}
                        contentContainerStyle={{ flexGrow: 1, paddingVertical: 20, paddingHorizontal: 8 }}
                        keyboardShouldPersistTaps="handled"
            >
                {blocks.map((block, index) => {
                    return (
                        <View key={block.id} style={{flexDirection: 'row', alignItems: 'center'}}>
                            {block.type === 'image' ? (
                                block.content && (
                                    <View style={{width: 180, height: 150, borderRadius: 16, marginVertical: 16, marginHorizontal: 8}}>
                                        <Image
                                            alt={"image"}
                                            source={{uri: block.content}}
                                            style={{width: "100%", height: "100%", borderRadius: 16}}
                                        />
                                        <TouchableOpacity onPress={() => removeBlock(block.id)} style={{position: "absolute", right: -16, top: -16, backgroundColor: Colors.dark500, borderRadius: 50, opacity: 0.6}}>
                                            <Ionicons name={"close-outline"} color={"white"} size={32} />
                                        </TouchableOpacity>
                                    </View>
                                )
                            ) : block.type === 'workout' ? (
                                <View style={{width: "80%", marginVertical: 24, marginHorizontal: 8}}>
                                    <RoutineCard workout={JSON.parse(block.content)} addAvailable={false} />
                                    <TouchableOpacity onPress={() => removeBlock(block.id)} style={{position: "absolute", right: -16, top: -16, backgroundColor: Colors.dark500, borderRadius: 50, opacity: 0.6}}>
                                        <Ionicons name={"close-outline"} color={"white"} size={32} />
                                    </TouchableOpacity>
                                </View>
                            ) : block.type === "exercise" ? (
                                <View style={{width: "90%", marginVertical: 24, marginHorizontal: 8}}>
                                    <ExerciseCard exercise={JSON.parse(block.content)} />
                                    <TouchableOpacity onPress={() => removeBlock(block.id)} style={{position: "absolute", right: -16, top: -16, backgroundColor: Colors.dark500, borderRadius: 50, opacity: 0.6}}>
                                        <Ionicons name={"close-outline"} color={"white"} size={32} />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <>
                                    <TextInput
                                        ref={(ref) => (inputRefs.current[block.id] = ref)}
                                        style={[styles.input, {
                                            fontSize: block.type === 'title' ? 24 : block.type === 'subtitle' ? 18 : 16,
                                            fontWeight: block.type === 'title' || block.type === 'subtitle' ? 'bold' : 'normal',
                                            paddingVertical: block.type === 'title' ? 12 : block.type === "subtitle" ? 8 : 4,
                                        }]}
                                        placeholder={block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                                        placeholderTextColor={Colors.dark300}
                                        value={block.content}
                                        onChangeText={(text) => updateBlockContent(block.id, text)}
                                        onKeyPress={({nativeEvent}) => {
                                            if (nativeEvent.key === 'Backspace' && block.content === '') {
                                                handleBackspacePress(block, index);
                                            }
                                        }}
                                        onBlur={() => setFocusedInputIdx(null)}
                                        onFocus={() => setFocusedInputIdx(index)}
                                        blurOnSubmit={false}
                                        multiline={true}
                                        returnKeyType="none"
                                    />
                                    <TouchableOpacity onPress={() => renderOptionsMenu(block.id)} style={{marginLeft: 6}}>
                                        <MaterialIcons name="format-size" size={20} color={Colors.dark300}/>
                                    </TouchableOpacity>
                                </>
                            )}

                        </View>
                    );
                })}
            </ScrollView>
            <PostAttachments onAddBlock={addBlock} insertAt={focusedInputIdx} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 0,
        borderRadius: 0,
        color: "white",
        textAlignVertical: 'top',
    }
})