import {Block} from "@features/create-post/model";
import React, {forwardRef} from "react";
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
}

export const BlockInput = forwardRef<TextInput, BlockInputProps>(({
                                                                      block,
                                                                      updateBlockContent,
                                                                      handleBackspacePress,
                                                                      renderOptionsMenu,
                                                                      onFocus,
                                                                      focusedInputIdx,
                                                                      onBlur
                                                                  }, ref) => {
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
                onChangeText={(text) => updateBlockContent(block.id, text)}
                onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace' && block.content === '') {
                        handleBackspacePress(block, focusedInputIdx || 0);
                    }
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                blurOnSubmit={false}
                multiline
                returnKeyType="none"
            />
            <TouchableOpacity onPress={() => renderOptionsMenu(block.id)} style={{ marginLeft: 6 }}>
                <MaterialIcons name="format-size" size={20} color={Colors.dark300} />
            </TouchableOpacity>
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