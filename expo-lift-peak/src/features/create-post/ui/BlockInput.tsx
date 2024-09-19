import {Block} from "@features/create-post/model";
import React, {forwardRef, useEffect, useRef} from "react";
import {TextInput, TouchableOpacity, StyleSheet} from "react-native";
import {Colors} from "@shared/styles";
import {MaterialIcons} from "@expo/vector-icons";

interface BlockInputProps {
    block: Block;
    updateBlockContent: (id: string, content: string) => void;
    handleBackspacePress: (block: Block, index: number) => void;
    renderOptionsMenu: (blockId: string) => void;
    onFocus: () => void;
    onBlur?: () => void;
    focusedInputIdx: number | null;
    isListMode?: boolean;
    setListMode: (enabled: boolean) => void;
}

export const BlockInput = forwardRef<TextInput, BlockInputProps>(({
                                                                      block,
                                                                      updateBlockContent,
                                                                      handleBackspacePress,
                                                                      renderOptionsMenu,
                                                                      onFocus,
                                                                      focusedInputIdx,
                                                                      onBlur,
                                                                      isListMode,
    setListMode
                                                                  }, ref) => {
    const previousTextRef = useRef(block.content);

    const handleTextChange = (text: string) => {
        const prevText = previousTextRef.current || '';
        const prevLines = prevText.split('\n');
        const newLines = text.split('\n');

        let updatedLines = [...newLines];

        if (isListMode) {
            for (let i = 0; i < newLines.length; i++) {
                if (i >= prevLines.length) {
                    // New line added
                    if (!newLines[i].startsWith('• ')) {
                        updatedLines[i] = '• ' + newLines[i];
                    }
                } else if (newLines[i] !== prevLines[i]) {
                    // Line modified
                    if (
                        !prevLines[i].startsWith('• ') &&
                        !newLines[i].startsWith('• ')
                    ) {
                        // Line was without bullet before and now, leave as is
                    } else if (
                        prevLines[i].startsWith('• ') &&
                        !newLines[i].startsWith('• ')
                    ) {
                        // User removed the bullet, disable list mode
                        setListMode(false);
                    } else if (!newLines[i].startsWith('• ')) {
                        // Add bullet to modified line
                        updatedLines[i] = '• ' + newLines[i];
                    }
                }
            }
        } else {
            // When list mode is off, do not modify text
            updatedLines = newLines;
        }

        const updatedText = updatedLines.join('\n');
        updateBlockContent(block.id, updatedText);

        // Update previousTextRef
        previousTextRef.current = updatedText;
    };

    return (
        <>
            <TextInput
                ref={ref}
                style={[
                    styles.input,
                    {
                        fontSize: block.type === 'title' ? 24 : block.type === 'subtitle' ? 18 : 16,
                        fontWeight: block.type === 'title' || block.type === 'subtitle' ? 'bold' : 'normal',
                        paddingVertical: block.type === 'title' ? 12 : block.type === 'subtitle' ? 8 : 4,
                    }
                ]}
                placeholder={block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                placeholderTextColor={Colors.dark300}
                value={block.content}
                onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace' && block.content === '') {
                        handleBackspacePress(block, focusedInputIdx || 0);
                    }
                    if(nativeEvent.key === 'Backspace' && block.content.slice(-2) === "• ") {
                        setListMode(false)
                    }
                    if(nativeEvent.key === ' ' && block.content.slice(-1) === "•") {
                        setListMode(true)
                    }
                }}
                onChangeText={handleTextChange}
                onFocus={onFocus}
                onBlur={onBlur}
                blurOnSubmit={false}
                multiline={ block.type !== 'title'}
                returnKeyType="none"
            />
        </>
    );
});

const styles = StyleSheet.create({
    input: {
        flex: 1,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 0,
        borderRadius: 0,
        color: 'white',
        textAlignVertical: 'top',
    }
});