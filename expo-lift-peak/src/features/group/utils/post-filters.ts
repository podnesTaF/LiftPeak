import {IPostContent} from "@entities/post";

export const getContentByType = (contents: IPostContent[]): {
    text: IPostContent[];
    image: IPostContent[];
    exercise: IPostContent[];
    workout: IPostContent[];
} => {
    return contents.reduce((acc, content) => {
        if (content.type === "text") {
            acc.text.push(content);
        } else if (content.type === "image") {
            acc.image.push(content);
        } else if (content.type === "exercise") {
            acc.exercise.push(content);
        } else if (content.type === "workout") {
            acc.workout.push(content);
        } else if(content.type === 'poll') {
            acc.workout.push(content)
        }
        return acc;
    }, {text: [] as IPostContent[], image: [] as IPostContent[], exercise: [] as IPostContent[], workout: [] as IPostContent[], poll: [] as IPostContent[]});
}