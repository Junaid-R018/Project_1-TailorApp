import { getDatabase } from "./database";
import { notifyDatabaseChanged } from "./dbEvents";

export type Customer = {
  id: number;
  first_name: string;
  phone: string;
  due_date: string | null;
  advance_amount: number;
  address: string | null;
  created_at: string;
};

export const addCustomer = async (
  firstName: string,
  phone: string,
  dueDate: string,
  advanceAmount: number,
  address: string,
) => {
  const database = await getDatabase();

  const sql = `
    INSERT INTO customers
    (
      first_name,
      phone,
      due_date,
      advance_amount,
      address,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ? )
  `;

  const result = await database.runAsync(sql, [
    firstName.trim(),
    phone.trim(),
    dueDate,
    advanceAmount,
    address.trim(),
    new Date().toISOString(),
  ]);

  console.log("Customer added:", result.lastInsertRowId);

  notifyDatabaseChanged();

  return result.lastInsertRowId;
};

export const getCustomers = async (): Promise<Customer[]> => {
  const database = await getDatabase();

  return await database.getAllAsync<Customer>(`
    SELECT *
    FROM customers
    ORDER BY id ASC
  `);
};

export const getCustomerById = async (
  customerId: number,
): Promise<Customer | null> => {
  const db = await getDatabase();

  const customer = await db.getFirstAsync<Customer>(
    `
    SELECT *
    FROM customers
    WHERE id = ?
    `,
    customerId,
  );

  return customer ?? null;
};

export const updateCustomer = async (
  id: number,
  firstName: string,
  phone: string,
  dueDate: string,
  advanceAmount: number,
  address: string,
) => {
  const db = await getDatabase();

  await db.runAsync(
    `
    UPDATE customers
    SET
      first_name = ?,
      phone = ?,
      due_date = ?,
      advance_amount = ?,
      address = ?,
    WHERE id = ?
    `,
    [
      firstName.trim(),
      phone.trim(),
      dueDate,
      advanceAmount,
      address.trim(),
      id,
    ],
  );

  console.log("Customer updated:", id);

  notifyDatabaseChanged();
};

export const deleteCustomer = async (customerId: number) => {
  const database = await getDatabase();

  try {
    await database.runAsync(
      `
      DELETE FROM orders
      WHERE customer_id = ?
      `,
      customerId,
    );

    await database.runAsync(
      `
      DELETE FROM measurements
      WHERE customer_id = ?
      `,
      customerId,
    );

    await database.runAsync(
      `
      DELETE FROM customers
      WHERE id = ?
      `,
      customerId,
    );

    console.log(`Customer ${customerId} and related data deleted`);

    notifyDatabaseChanged();
  } catch (error) {
    console.error("Failed to delete customer:", error);
    throw error;
  }
};
