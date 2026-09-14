import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';
import { NotificationType } from '../common/enums';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(
    user: User,
    title: string,
    message: string,
    type: NotificationType = NotificationType.SYSTEM,
    actionLink?: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user,
      title,
      message,
      type,
      actionLink,
      isRead: false,
    });
    return this.notificationRepository.save(notification);
  }

  async findAllForUser(user: User): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markAsRead(user: User, id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(user: User) {
    await this.notificationRepository.update(
      { user: { id: user.id }, isRead: false },
      { isRead: true },
    );
    return { success: true, message: 'All notifications marked as read' };
  }

  async getUnreadCount(user: User): Promise<number> {
    return this.notificationRepository.count({
      where: { user: { id: user.id }, isRead: false },
    });
  }
}
