import {BaseEntity} from "@shared/model/BaseEntity";
import {IUser} from "@entities/user";
import GroupPost from "@features/group/ui/GroupPost";
import {IGroupPost} from "@entities/post";
import {IWorkout} from "@entities/workout";
import {IComment} from "@entities/reaction";
import {IGroup} from "@entities/group";

export enum NotificationType {
    follow = 'follow',
    like = 'like',
    challenge = 'challenge',
    routine = 'routine',
    comment = 'comment',
    group_follow = 'follow_like',
    group_like = 'group_like',
    group_comment = 'group_comment',
}

export interface INotification extends BaseEntity {
    id: number;
    type: NotificationType;
    isRead: boolean;
    senderId: number;
    sender: IUser;
    recipientId: number;
    isFollowing?: boolean;
    recipient: IUser;
    postId?: number; // Optional as some notifications may not have a post
    post?: IGroupPost;
    workoutId?: number; // Optional as some notifications may not have a workout
    workout?: IWorkout;
    commentId?: number; // Optional for notifications not related to comments
    comment?: IComment;
    groupId?: number; // Optional for non-group related notifications
    group?: IGroup;
    message?: string; // Optional custom message for notifications
}