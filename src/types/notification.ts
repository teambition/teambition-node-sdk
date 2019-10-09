export interface AppNotificationRule {
  appId: string;
  tags: string[];
  channels: string[];
  rule: string;
  badgeType: string;
  restore: boolean;
}

export interface NotificationPayloadAction {
  name: string;
  actionUrl: string;
  fallbackUrl: string;
}

export interface IncreaseNotificationPayload {
  title: { [x: string]: string } | string;
  summary: { [x: string]: string } | string;
  avatarUrl: string;
  icon: string;
  actions: NotificationPayloadAction[];
  [x: string]: any;
}

export interface IncreaseUnreadCountOptions {
  userIds?: string[];
  appId: string;
  boundToObjectTime?: Date;
  threadTags?: string[];
  pushTags?: string[];
  inc?: number;
  payload?: IncreaseNotificationPayload;
  rules?: string[];
  mentionMe?: boolean;
  slientTag?: boolean; // legacy
  updateOnlyExists?: boolean;
  remainSortTime?: boolean;
}
