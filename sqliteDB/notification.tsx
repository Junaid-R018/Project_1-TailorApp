import { getDatabase } from "./database";

export type NotificationRecord = {
  id: number;
  title: string;
  message: string;
  type: string;
  reference_id: number | null;
  is_read: number;
  created_at: string;
};

export const addNotification = async (
  title: string,
  message: string,
  type: string,
  referenceId: number | null = null,
) => {
  const db = await getDatabase();

  const result = await db.runAsync(
    `
    INSERT INTO notifications
      (title, message, type, reference_id, is_read, created_at)
    VALUES (?, ?, ?, ?, 0, ?)
    `,
    [title, message, type, referenceId, new Date().toISOString()],
  );

  return result.lastInsertRowId;
};
export const getNotifications = async () => {
  const db = await getDatabase();

  return await db.getAllAsync<NotificationRecord>(
    `
    SELECT *
    FROM notifications
    ORDER BY created_at DESC
    `,
  );
};
export const getUnreadNotificationCount = async () => {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{ count: number }>(
    `
    SELECT COUNT(*) as count
    FROM notifications
    WHERE is_read = 0
    `,
  );

  return result?.count ?? 0;
};

export const deleteNotification = async (id: number) => {
  const db = await getDatabase();

  await db.runAsync(
    `
    DELETE FROM notifications
    WHERE id = ?
    `,
    [id],
  );
};
export const deleteAllNotifications = async () => {
  const db = await getDatabase();

  await db.runAsync(`
    DELETE FROM notifications
  `);
};
export const markAllNotificationsAsRead = async () => {
  const db = await getDatabase();

  await db.runAsync(`
    UPDATE notifications
    SET is_read = 1
    WHERE is_read = 0
  `);
};
