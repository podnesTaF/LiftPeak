import {BlockMedia} from "@features/create-post/ui/BlockMedia";
import React from "react";
import {BlockInput} from "@features/create-post/ui/BlockInput";
import {TextInput, View} from "react-native";
import {Block} from "@features/create-post/model";

interface BlockRendererProps {
    block: Block;
    index: number;
    inputRefs: React.MutableRefObject<Record<string, TextInput | null>>;
    updateBlockContent: (id: string, content: string) => void;
    handleBackspacePress: (block: Block, index: number) => void;
    renderOptionsMenu: (blockId: string) => void;
    removeBlock: (id: string) => void;
    setFocusedInputIdx: React.Dispatch<React.SetStateAction<number | null>>;
    focusedInputIdx: number | null;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
                                                                block,
                                                                index,
                                                                inputRefs,
                                                                updateBlockContent,
                                                                handleBackspacePress,
                                                                renderOptionsMenu,
                                                                removeBlock,
                                                                setFocusedInputIdx,
                                                                focusedInputIdx,
                                                            }) => {
    const handleInputFocus = () => {
        setFocusedInputIdx(index);
    };

    return (
        <View key={block.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
            {block.type === 'image' && block.content ? (
                <BlockMedia block={block} removeBlock={removeBlock} />
            ) : block.type === 'workout' ? (
                <BlockMedia block={block} removeBlock={removeBlock} isRoutine />
            ) : block.type === 'exercise' ? (
                <BlockMedia block={block} removeBlock={removeBlock} isExercise />
            ) : (
                <BlockInput
                    ref={(ref) => (inputRefs.current[block.id] = ref)}
                    block={block}
                    updateBlockContent={updateBlockContent}
                    handleBackspacePress={handleBackspacePress}
                    renderOptionsMenu={renderOptionsMenu}
                    onFocus={handleInputFocus}
                    onBlur={() => {
                        setFocusedInputIdx(null)
                    }}
                    focusedInputIdx={focusedInputIdx}
                />
            )}
        </View>
    );
}