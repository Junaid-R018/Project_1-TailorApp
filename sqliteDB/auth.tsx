import { getDatabase } from "./database";

export type User = {
  id?: number;
  First_Name: string;
  Last_Name: string;
  phone: string;
  password: string;
};

export const saveUser = async (user: User) => {
  const db = await getDatabase();

  await db.runAsync(
    `
    INSERT INTO users (
      first_name,
      last_name,
      phone,
      password,
      created_at
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    user.First_Name,
    user.Last_Name,
    user.phone,
    user.password,
    new Date().toISOString(),
  );
};

export const updateUserProfile = async (
  phone: string,
  firstName: string,
  lastName: string,
): Promise<boolean> => {
  const db = await getDatabase();

  const result = await db.runAsync(
    `UPDATE users SET first_name = ?, last_name = ? WHERE phone = ?`,
    firstName,
    lastName,
    phone,
  );

  return result.changes > 0;
};

export const getUser = async (phone?: string): Promise<User | null> => {
  const db = await getDatabase();

  const user = phone
    ? await db.getFirstAsync<{
        id: number;
        first_name: string;
        last_name: string;
        phone: string;
        password: string;
      }>(`SELECT * FROM users WHERE phone = ? LIMIT 1`, phone)
    : await db.getFirstAsync<{
        id: number;
        first_name: string;
        last_name: string;
        phone: string;
        password: string;
      }>(`SELECT * FROM users LIMIT 1`);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    First_Name: user.first_name,
    Last_Name: user.last_name,
    phone: user.phone,
    password: user.password,
  };
};

export const validateUser = async (
  phone: string,
  password: string,
): Promise<boolean> => {
  const db = await getDatabase();

  const user = await db.getFirstAsync(
    `
    SELECT id
    FROM users
    WHERE phone = ?
    AND password = ?
    LIMIT 1
    `,
    phone,
    password,
  );

  return !!user;
};

export const updatePassword = async (
  phone: string,
  newPassword: string,
): Promise<boolean> => {
  const db = await getDatabase();

  const result = await db.runAsync(
    `
    UPDATE users
    SET password = ?
    WHERE phone = ?
    `,
    newPassword,
    phone,
  );

  return result.changes > 0;
};

export const removeUser = async (phone: string) => {
  const db = await getDatabase();

  await db.runAsync(`DELETE FROM users WHERE phone = ?`, phone);
};
