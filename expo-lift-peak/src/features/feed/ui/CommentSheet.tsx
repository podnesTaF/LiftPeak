import React, {forwardRef, useCallback, useEffect, useRef, useState} from 'react';
import {
    BottomSheetBackdrop,
    BottomSheetFooter,
    BottomSheetFooterProps, BottomSheetHandleProps,
    BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput,
    BottomSheetView
} from "@gorhom/bottom-sheet";
import {View, StyleSheet, Text, TouchableOpacity} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import Button from "@shared/components/Button";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useToastStore} from "@shared/store";
import {BlurView} from "expo-blur";
import {useCommentStore, WorkoutPostBody} from "@features/feed";
import Constants from 'expo-constants';
import Comment from "@features/feed/ui/Comment";
import {CommentType, getComments, leaveComment} from "@entities/reaction";
import { renderBottomSheetBackdrop } from '@shared/components/bottomSheet/bottomSheetBackdrop';

interface CommentSheetProps {
}

export const CommentSheetProvider = ({children}: {children: React.ReactNode}) => {
    const ref = useRef<BottomSheetModal>();
    const {shown} = useCommentStore()
    const handleClosePress = () => ref.current?.close();
    const handlePresentPress = () => ref.current?.present();

    useEffect(() => {
        if (shown) {
            handlePresentPress()
        } else {
            handleClosePress()
        }
    }, [shown]);

    return (
        <>
            {children}
            <CommentSheet ref={ref as any} />
        </>
    )
}

const CommentSheet = forwardRef<BottomSheetModal, {}>(({}:CommentSheetProps, ref: React.ForwardedRef<BottomSheetModal>) => {
    const {workout, post, type, hide} = useCommentStore()


    const {data, refetch} = useQuery({
        queryKey: ["comments", workout?.id],
        queryFn: () => getComments((workout?.id || post?.id)!, type),
        enabled: !!(workout?.id || post?.id)
    })


    const renderFooter = useCallback((props: BottomSheetFooterProps) => (
        <BottomSheetFooter {...props}>
            <BlurView style={{paddingHorizontal: 12, paddingBottom: 32, paddingVertical: 6, borderTopWidth: StyleSheet.hairlineWidth, borderColor: Colors.dark500 }} intensity={50} tint={"dark"}>
                <CommentInput type={type} relatedEntityId={(workout?.id as number || post?.id as number)} refetch={refetch} />
            </BlurView>
        </BottomSheetFooter>
    ), [workout])

    const memoizedBackdrop = useCallback(renderBottomSheetBackdrop, []);

    const renderHeader = useCallback((props: BottomSheetHandleProps) => (
        <View
            style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: 16
        }}>
            <View style={{position: "absolute", left: 12, top: 12}}>
                <TouchableOpacity onPress={hide}>
                    <Ionicons name={"chevron-down"} size={30} color={"white"} />
                </TouchableOpacity>
            </View>
            <Text style={[defaultStyles.smallTitle]}>
                Comments
            </Text>
        </View>
    ), [])

    return (
        <BottomSheetModal
            footerComponent={renderFooter}
            backgroundStyle={{
                backgroundColor: Colors.dark900,
            }}
            ref={ref}
            onDismiss={() => {
                hide()
            }}
            topInset={Constants.statusBarHeight}
            handleComponent={renderHeader}
            backdropComponent={memoizedBackdrop}
            enablePanDownToClose={true}
            snapPoints={["100%"]}
        >
            <BottomSheetView style={{paddingVertical: 16, paddingHorizontal: 16}}>
                <View style={{paddingTop: 16, gap:16, paddingBottom: 12, borderBottomColor: Colors.dark500, borderBottomWidth: StyleSheet.hairlineWidth}}>
                    {workout && (
                        <WorkoutPostBody workout={workout} />
                    )}
                </View>
            </BottomSheetView>
            <BottomSheetScrollView style={{flex: 1, maxWidth: "100%",}} contentContainerStyle={{paddingHorizontal: 12, paddingVertical: 12, gap: 12, paddingBottom: 120}}>
                {data && data.length ? data?.map(comment => (
                    <Comment comment={comment} key={comment.id} />
                )) : (
                    <View style={{alignItems: "center", flex: 1}}>
                        <Text style={[defaultStyles.smallTitle, {color: Colors.dark300}]}>
                            No Comments Yet
                        </Text>
                    </View>
                )}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});

interface CommentInputProps {
    relatedEntityId: number,
    type: CommentType,
    refetch: any
}

const CommentInput = ({relatedEntityId,type,refetch}: CommentInputProps) => {
    const {showToast} = useToastStore()
    const [comment, setComment] = useState<string>("");
    const {mutate, isPending} = useMutation({
        mutationFn: async (comment: string) => {
            await leaveComment(relatedEntityId, type,  comment);
        },
        onSuccess: () => {
            showToast("Comment sent!", "Your comment has been sent successfully.", "success", 2000)
            setComment("")
            refetch()
        },
        onError: (error) => {
            showToast("Error", "An error occurred while sending your comment.", "error")
        },
    })

    const handleTextChange = (text: string) => {
        setComment(text);
    };


    return (
        <View style={[defaultStyles.row, {gap: 12}]}>
            <BottomSheetTextInput style={styles.input} value={comment} onChangeText={handleTextChange} placeholder={"Add a comment..."} />
            <Button disabled={!comment.length || isPending} color={"dark700"} onPress={() => mutate(comment)} isLoading={isPending}>
                <MaterialIcons name={"near-me"} size={24} color={"white"} />
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        flex:1,
        borderRadius: 8,
        backgroundColor: Colors.dark700,
        color: Colors.white,
        paddingVertical: 16,
        paddingHorizontal: 12,
        fontSize: 16,
    }
});

export default CommentSheet;