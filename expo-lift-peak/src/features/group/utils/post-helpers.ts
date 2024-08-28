import {TextType} from "@entities/post";
import {StyleProp, TextStyle} from "react-native";

export const getTextStyle = (type: TextType): StyleProp<TextStyle> => {
    return {
        fontSize: type === 'title' ? 20 : type === 'subtitle' ? 16 : 14,
        fontWeight: type === 'title' || type === 'subtitle' ? 'bold' : 'normal',
        paddingVertical: type === 'title' ? 8 : type === 'subtitle' ? 4 : 2,
    }
}