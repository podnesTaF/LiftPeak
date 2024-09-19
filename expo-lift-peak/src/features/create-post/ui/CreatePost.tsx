import React, {useRef, useState} from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {defaultStyles} from "@shared/styles";
import PostAttachments from "@features/create-post/ui/PostAttachments";
import {Block, BlockType} from "@features/create-post/model";
import {TextType} from "@entities/post";
import {BlockRenderer} from "@features/create-post/ui/BlockRenderer";
import {usePostStore} from "@features/create-post/store/postStore";

interface CreatePostProps {

}

export function CreatePost({}: CreatePostProps) {
    const [focusedInputIdx, setFocusedInputIdx] = useState<number | null>(null);
    const scrollRef = useRef<ScrollView | null>(null);
    const inputRefs = useRef<Record<string, TextInput | null>>({});
    const [isListMode, setIsListMode] = useState(false)
    const { blocks, addBlock: addStoreBlock, removeBlock, setBlocks } = usePostStore();

    const addBlock = (
        type: BlockType = TextType.TEXT,
        insertAt: number | null = null,
        content?: string
    ) => {
        const newBlock: Block = {
            id: uuidv4(),
            type,
            content: content || '',
        };
        if (insertAt === null) {
            addStoreBlock(newBlock);
            setFocusedInputIdx(blocks.length + 1);
        } else {
            const updatedBlocks = [
                ...blocks.slice(0, insertAt + 1),
                newBlock,
                ...blocks.slice(insertAt + 1),
            ];
            setBlocks(updatedBlocks);
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
        setBlocks(
            blocks.map((block) =>
                block.id === id ? { ...block, content } : block
            )
        );
    };


    const handleBackspacePress = (block: Block, index: number) => {
        if (block.content === '' && blocks.length > 1) {
            const previousBlockId = blocks[index - 1]?.id;
            inputRefs.current[previousBlockId]?.focus();

            const updatedBlocks = [
                ...blocks.slice(0, index),
                ...blocks.slice(index + 1),
            ];
            setBlocks(updatedBlocks);

            if (Object.values(TextType).includes(block.type as TextType)) {
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
                {
                    text: 'Title',
                    onPress: () => {
                        setBlocks(
                            blocks.map((block) =>
                                block.id === blockId ? { ...block, type: TextType.TITLE } : block
                            )
                        );
                    },
                },
                {
                    text: 'Subtitle',
                    onPress: () => {
                        setBlocks(
                            blocks.map((block) =>
                                block.id === blockId ? { ...block, type: TextType.SUBTITLE } : block
                            )
                        );
                    },
                },
                {
                    text: 'Text',
                    onPress: () => {
                        setBlocks(
                            blocks.map((block) =>
                                block.id === blockId ? { ...block, type: TextType.TEXT } : block
                            )
                        );
                    },
                },
                {
                    text: 'Remove Block',
                    onPress: () => removeBlock(blockId),
                    style: 'destructive',
                },
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
                        removeBlock={removeBlock}
                        setFocusedInputIdx={setFocusedInputIdx}
                        focusedInputIdx={focusedInputIdx}
                        setListMode={setIsListMode}
                        isListMode={isListMode}
                    />
                ))}
            </ScrollView>
            <PostAttachments setListMode={setIsListMode} isListMode={isListMode} onAddBlock={addBlock} insertAt={focusedInputIdx} />
        </KeyboardAvoidingView>
    );
}