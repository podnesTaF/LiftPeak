import {NotificationType} from "@entities/notifications";
import {cutString} from "@shared/utils";

export const getActionByType = (type: NotificationType, message?: string) => {
    switch (type) {
        case NotificationType.follow:
            return "started following you";
        case NotificationType.like:
            return "liked your workout";
        case NotificationType.comment:
            return "commented on your workout" + (message ? `: "${cutString(message, 10)}"` : "");
        case NotificationType.routine:
            return "saved your workout";
        case NotificationType.challenge:
            return "send you a challenge"
        case NotificationType.group_like:
            return "liked your group post";
        case NotificationType.group_comment:
            return "commented on your group post";
        case NotificationType.group_follow:
            return "started following your group";
        default:
            return "";
    }
}