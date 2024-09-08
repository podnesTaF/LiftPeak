import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  // Create a new notification
  async createNotification({
    type,
    senderId,
    recipientId,
    postId,
    commentId,
    groupId,
    message,
    workoutId,
  }: CreateNotificationDto): Promise<Notification> {
    // find duplicate notification
    const existingNotification = await this.notificationRepository.findOne({
      where: {
        type,
        senderId,
        recipientId,
        postId,
        commentId,
        groupId,
        workoutId,
      },
    });

    if (existingNotification) {
      return existingNotification;
    }

    const notification = this.notificationRepository.create({
      type,
      senderId,
      recipientId,
      postId,
      commentId,
      groupId,
      message,
      workoutId,
    });

    return await this.notificationRepository.save(notification);
  }

  // Retrieve notifications for a specific user (paginated)
  async getUserNotifications(
    userId: number,
    page: number = 1,
    limit: number = 100,
  ) {
    const [notifications, total] =
      await this.notificationRepository.findAndCount({
        where: { recipientId: userId },
        order: { createdAt: 'DESC' },
        relations: [
          'sender',
          'post.contents',
          'comment',
          'group',
          'workout.mediaContents',
        ],
        take: limit,
        skip: (page - 1) * limit,
      });

    return {
      data: notifications,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    return await this.notificationRepository.save(notification);
  }

  async getUnseenNotificationsCount(userId: number): Promise<number> {
    return await this.notificationRepository.count({
      where: { recipientId: userId, isRead: false },
    });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { recipientId: userId, isRead: false },
      { isRead: true },
    );
  }

  async deleteNotification(notificationId: number): Promise<void> {
    await this.notificationRepository.delete(notificationId);
  }

  async deleteAllNotifications(userId: number): Promise<void> {
    await this.notificationRepository.delete({ recipientId: userId });
  }
}
