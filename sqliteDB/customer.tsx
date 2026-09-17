import { getDatabase } from "./database";

export type Customer = {
  id: number;
  first_name: string;
  phone: string;
  due_date: string | null;
  advance_amount: number;
  address: string | null;
  notes: string | null;
  created_at: string;
};

export const addCustomer = async (
  firstName: string,
  phone: string,
  dueDate: string,
  advanceAmount: number,
  address: string,
  notes: string,
) => {
  const database = await getDatabase();

  const sql = `
    INSERT INTO customers
    (first_name, phone, due_date, advance_amount, address, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  console.log("Customer INSERT SQL:", sql);

  const result = await database.runAsync(sql, [
    firstName.trim(),
    phone.trim(),
    dueDate,
    advanceAmount,
    address.trim(),
    notes.trim(),
    new Date().toISOString(),
  ]);

  console.log("Customer added:", result.lastInsertRowId);

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
  notes: string,
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
      notes = ?
    WHERE id = ?
    `,
    [firstName, phone, dueDate, advanceAmount, address, notes, id],
  );

  console.log("Customer updated:", id);
};

export const deleteCustomer = async (id: number) => {
  const database = await getDatabase();

  await database.runAsync(
    `
      DELETE FROM customers
      WHERE id = ?
    `,
    [id],
  );

  console.log("Customer deleted:", id);
};
