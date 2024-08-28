import {IPostContent} from "@entities/post";

export interface CreatePostDto {
    contents: CreateContentDto[];
}

export interface CreateContentDto extends Omit<IPostContent, "id" | "postId"> {
}