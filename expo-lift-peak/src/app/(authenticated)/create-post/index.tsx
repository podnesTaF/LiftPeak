import React, {useState} from 'react';
import {CreatePost} from "@features/create-post/ui/CreatePost";
import {Block, CreatePostDto} from "@features/create-post/model";
import {PostContentType, TextType} from "@entities/post";
import {useMutation} from "@tanstack/react-query";
import {createPost} from "@features/create-post/api/CreatePostApi";
import {useToastStore} from "@shared/store";
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import {v4 as uuidv4} from "uuid";
import {TouchableOpacity} from "react-native";
import Button from "@shared/components/Button";
import {uploadMedia} from "@features/media-upload";

const CreateGroupPost = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: uuidv4(), type: TextType.TITLE, content: '' },
  ]);
  const { showToast } = useToastStore();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: (dto: CreatePostDto)=> createPost(groupId || '1', dto),
    onSuccess: () => {
      showToast('Post Created', 'success', 'success', 3000);
      router.push('/(authenticated)/(tabs)/groups/' + groupId);
    },
    onError: () => {
      showToast('Failed to create post', 'error', 'error', 3000);
    },
  });

  const {mutateAsync: uploadImage} = useMutation({
    mutationFn: async (systemUrl: string) => uploadMedia([systemUrl]),
  })


  const handlePostCreation = async (blocks: Block[]) => {
    const dto: CreatePostDto = {
      contents: await Promise.all(blocks.map(async ({ type, content }) => {
        const isText = Object.values(TextType).includes(type as TextType);

        let contentType = isText ? 'text' : type;
        let textType = isText ? (type as TextType) : undefined;

        let imageUrl
        if(type === 'image' && content) {
          imageUrl = await uploadImage(content);
        }

        return {
          type: contentType as PostContentType,
          textType: textType,
          content: isText ? content : undefined,
          exerciseId: type === 'exercise' ? JSON.parse(content).id : undefined,
          workoutId: type === 'workout' ? JSON.parse(content).id : undefined,
          imageUrl: imageUrl || undefined
        };
      })),
    };
    mutate(dto);
  };

  return (
      <>
        <Stack.Screen options={{
          headerRight: () => (
              <Button color={"transparent"} title={"Post"} onPress={() => handlePostCreation(blocks)} />
          )
        }} />
        <CreatePost blocks={blocks} setBlocks={setBlocks} />
      </>
  )
};

export default CreateGroupPost;