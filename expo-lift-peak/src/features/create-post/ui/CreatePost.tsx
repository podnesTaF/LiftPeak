import React, {useRef, useState} from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {Colors, defaultStyles} from "@shared/styles";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import PostAttachments from "@features/create-post/ui/PostAttachments";
import {RoutineCard} from "@entities/routine";
import {ExerciseCard} from "@entities/exercise";
import {Block, BlockType, CreateContentDto, CreatePostDto} from "@features/create-post/model";
import {PostContentType, TextType} from "@entities/post";
import {useMutation} from "@tanstack/react-query";
import {createPost} from "@features/create-post/api/CreatePostApi";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useToastStore} from "@shared/store";
import {useRoute} from "@react-navigation/core";
import {BlockRenderer} from "@features/create-post/ui/BlockRenderer";

export function CreatePost() {
    const { groupId } = useLocalSearchParams<{ groupId: string }>();
    const [blocks, setBlocks] = useState<Block[]>([
        { id: uuidv4(), type: TextType.TITLE, content: '' },
    ]);

    const { showToast } = useToastStore();
    const router = useRouter();
    const [focusedInputIdx, setFocusedInputIdx] = useState<number | null>(null);
    const scrollRef = useRef<ScrollView | null>(null);
    const inputRefs = useRef<Record<string, TextInput | null>>({});
    const { mutate } = useMutation({
        mutationFn: (dto: CreatePostDto) => createPost(groupId || '1', dto),
        onSuccess: () => {
            showToast('Post Created', 'success', 'success', 3000);
            router.push('/(authenticated)/(tabs)/groups/' + groupId);
        },
        onError: () => {
            showToast('Failed to create post', 'error', 'error', 3000);
        },
    });


    const addBlock = (type: BlockType = TextType.TEXT, insertAt: number | null = null, content?: string) => {
        const newBlock: Block = {
            id: uuidv4(),
            type,
            content: content || '',
        };
        if (insertAt === null) {
            setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
            setFocusedInputIdx(blocks.length + 1);
        } else {
            setBlocks((prevBlocks) => [
                ...prevBlocks.slice(0, insertAt + 1),
                newBlock,
                ...prevBlocks.slice(insertAt + 1),
            ]);
            if (type === 'text') {
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
        }, 100);
    };

    const updateBlockContent = (id: string, content: string) => {
        setBlocks((prevBlocks) =>
            prevBlocks.map((block) =>
                block.id === id ? { ...block, content } : block
            )
        );
    };

    const handlePostCreation = () => {
        const dto: CreatePostDto = {
            contents: blocks.map(({ type, content }) => {
                const isText = Object.values(TextType).includes(type as TextType);

                let contentType = isText ? 'text' : type;
                let textType = isText ? (type as TextType) : undefined;

                return {
                    type: contentType as PostContentType,
                    textType: textType,
                    content: isText ? content : undefined,
                    exerciseId: type === 'exercise' ? JSON.parse(content).id : undefined,
                    workoutId: type === 'workout' ? JSON.parse(content).id : undefined,
                    imageUrl: type === 'image' ? content : undefined,
                };
            }),
        };
        mutate(dto);
    };

    const handleBackspacePress = (block: Block, index: number) => {
        if (block.content === '' && blocks.length > 1) {
            const previousBlockId = blocks[index - 1]?.id;
            inputRefs.current[previousBlockId]?.focus();

            setBlocks((prevBlocks) => [
                ...prevBlocks.slice(0, index),
                ...prevBlocks.slice(index + 1),
            ]);

            if(Object.values(TextType).includes(block.type as TextType)) {
                setFocusedInputIdx(index - 1);
            } else {
                setFocusedInputIdx(null);
            }
        }
    };

    const renderOptionsMenu = (blockId: string) => {
        Alert.alert(
            'Select Block Type',
            '',
            [
                { text: 'Title', onPress: () => setBlocks((prevBlocks) => prevBlocks.map((block) => block.id === blockId ? { ...block, type: TextType.TITLE } : block)) },
                { text: 'Subtitle', onPress: () => setBlocks((prevBlocks) => prevBlocks.map((block) => block.id === blockId ? { ...block, type: TextType.SUBTITLE } : block)) },
                { text: 'Text', onPress: () => setBlocks((prevBlocks) => prevBlocks.map((block) => block.id === blockId ? { ...block, type: TextType.TEXT } : block)) },
                { text: 'Remove Block', onPress: () => setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== blockId)), style: 'destructive' },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 80}
            behavior={
            Platform.OS === 'ios' ? 'padding' : 'height'
        } style={[defaultStyles.container]}>
            <ScrollView>
                {blocks.map((block, index) => (
                    <BlockRenderer
                        key={block.id}
                        block={block}
                        index={index}
                        inputRefs={inputRefs}
                        updateBlockContent={updateBlockContent}
                        handleBackspacePress={handleBackspacePress}
                        renderOptionsMenu={renderOptionsMenu}
                        removeBlock={(id) => setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== id))}
                        setFocusedInputIdx={setFocusedInputIdx}
                        focusedInputIdx={focusedInputIdx}
                    />
                ))}
            </ScrollView>
            <PostAttachments onAddBlock={addBlock} insertAt={focusedInputIdx} />
        </KeyboardAvoidingView>
    );
}