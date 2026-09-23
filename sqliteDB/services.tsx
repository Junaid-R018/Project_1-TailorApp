import { getDatabase } from "./database";

export type Service = {
  id: number;
  name: string;
  icon: string | null;
  is_active: number;
  created_at: string;
};

export const getServices = async (): Promise<Service[]> => {
  const database = await getDatabase();

  const result = await database.getAllAsync<Service>(`
    SELECT *
    FROM services
    WHERE is_active = 1
    ORDER BY id ASC
  `);
  // console.log(`Services From DB`, result);

  return result;
};

export const getAllServices = async (): Promise<Service[]> => {
  const database = await getDatabase();

  const result = await database.getAllAsync<Service>(`
    SELECT *
    FROM services
    ORDER BY id ASC
  `);

  return result;
};

export const getServiceOrderCount = async (
  serviceId: number,
): Promise<number> => {
  const database = await getDatabase();

  const result = await database.getFirstAsync<{ count: number }>(
    `
      SELECT COUNT(*) as count
      FROM orders
      WHERE service_id = ?
    `,
    serviceId,
  );

  return result?.count ?? 0;
};

export const addService = async (
  name: string,
  icon: string,
  isActive: number = 1,
): Promise<number> => {
  const database = await getDatabase();

  const result = await database.runAsync(
    `
      INSERT INTO services (name, icon, is_active, created_at)
      VALUES (?, ?, ?, ?)
    `,
    name.trim(),
    icon,
    isActive,
    new Date().toISOString(),
  );

  return result.lastInsertRowId;
};
export const updateService = async (
  id: number,
  name: string,
  icon: string,
  isActive: number,
): Promise<void> => {
  const database = await getDatabase();

  await database.runAsync(
    `
      UPDATE services
      SET name = ?, icon = ?, is_active = ?
      WHERE id = ?
    `,
    name.trim(),
    icon,
    isActive,
    id,
  );
};

export const toggleServiceStatus = async (
  id: number,
  isActive: number,
): Promise<void> => {
  const database = await getDatabase();

  await database.runAsync(
    `
      UPDATE services
      SET is_active = ?
      WHERE id = ?
    `,
    isActive,
    id,
  );
};

export type ServiceOrder = {
  id: number;
  order_code: string;
  customer_id: number | null;
  customer_name: string | null;
  service_id: number | null;
  status: string;
  amount: number;
  delivery_date: string | null;
  created_at: string;
};
export const getOrdersByService = async (
  serviceId: number,
): Promise<ServiceOrder[]> => {
  const database = await getDatabase();

  return await database.getAllAsync<ServiceOrder>(
    `
      SELECT
        orders.*,
        customers.first_name AS customer_name
      FROM orders
      LEFT JOIN customers
        ON customers.id = orders.customer_id
      WHERE orders.service_id = ?
      ORDER BY orders.id DESC
    `,
    serviceId,
  );
};
