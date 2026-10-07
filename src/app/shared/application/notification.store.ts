import {computed, Injectable, signal} from '@angular/core';

export type NotificationSeverity = 'info' | 'success' | 'warn' | 'danger';

export interface AppNotification {
  id: number;
  severity: NotificationSeverity;
  summaryKey: string;
  detailKey: string;
  params: Record<string, string | number>;
  read: boolean;
  createdAt: string;
}

@Injectable({providedIn: 'root'})
export class NotificationStore {
  private readonly notificationsSignal = signal<AppNotification[]>([]);

  readonly notifications = this.notificationsSignal.asReadonly();

  readonly unreadCount = computed(() => this.notifications().filter(notification => !notification.read).length);

  notify(props: { severity?: NotificationSeverity; summaryKey: string; detailKey?: string; params?: Record<string, string | number> }): void {
    this.notificationsSignal.update(notifications => [{
      id: Date.now() + notifications.length,
      severity: props.severity ?? 'info',
      summaryKey: props.summaryKey,
      detailKey: props.detailKey ?? '',
      params: props.params ?? {},
      read: false,
      createdAt: new Date().toISOString()
    }, ...notifications]);
  }

  markAllAsRead(): void {
    this.notificationsSignal.update(notifications => notifications.map(notification => ({ ...notification, read: true })));
  }

  clear(): void {
    this.notificationsSignal.set([]);
  }
}
