import { getDatabase } from "./database";

export type OrderStatus =
  | "New"
  | "Pending"
  | "Ready"
  | "Delivered"
  | "Cancelled";

export type Order = {
  id: number;
  order_code: string;
  customer_id: number | null;
  service_id: number | null;
  status: OrderStatus;
  amount: number;
  delivery_date: string | null;
  created_at: string;
};

export const getRecentOrders = async (): Promise<OrderWithCustomer[]> => {
  const database = await getDatabase();

  const orders = await database.getAllAsync<OrderWithCustomer>(`
    SELECT
      orders.id,
      orders.order_code,
      orders.customer_id,
      orders.service_id,
      orders.status,
      orders.amount,
      orders.delivery_date,
      orders.created_at,

      customers.first_name AS customerName,
      customers.phone AS customerPhone

    FROM orders

    LEFT JOIN customers
      ON orders.customer_id = customers.id

    ORDER BY orders.id DESC
    LIMIT 5
  `);

  return orders;
};

// Add new order
export const addOrder = async (
  orderCode: string,
  customerId: number | null,
  serviceId: number | null,
  amount: number,
  deliveryDate: string | null,
) => {
  const database = await getDatabase();

  await database.runAsync(
    `
    INSERT INTO orders (
      order_code,
      customer_id,
      service_id,
      status,
      amount,
      delivery_date,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    orderCode,
    customerId,
    serviceId,
    "New",
    amount,
    deliveryDate,
    new Date().toISOString(),
  );
};
// get all orders
export type OrderWithCustomer = Order & {
  customerName: string;
  customerPhone: string;
};

export const getAllOrders = async (): Promise<OrderWithCustomer[]> => {
  const database = await getDatabase();

  const orders = await database.getAllAsync<OrderWithCustomer>(`
    SELECT
      orders.id,
      orders.order_code,
      orders.customer_id,
      orders.service_id,
      orders.status,
      orders.amount,
      orders.delivery_date,
      orders.created_at,

      customers.first_name AS customerName,
      customers.phone AS customerPhone

    FROM orders

    LEFT JOIN customers
      ON orders.customer_id = customers.id
    ORDER BY orders.id DESC
  `);

  // console.log("All Orders From DB:", orders);

  return orders;
};

export const searchOrders = async (
  query: string,
): Promise<OrderWithCustomer[]> => {
  const db = await getDatabase();

  const search = `%${query.trim()}%`;

  const result = await db.getAllAsync<OrderWithCustomer>(
    `
    SELECT
      orders.id,
      orders.order_code,
      orders.customer_id,
      orders.service_id,
      orders.status,
      orders.amount,
      orders.delivery_date,
      orders.created_at,

      customers.first_name AS customerName,
      customers.phone AS customerPhone

    FROM orders

    LEFT JOIN customers
      ON orders.customer_id = customers.id

    WHERE
      customers.first_name LIKE ?
      OR customers.phone LIKE ?
      OR orders.order_code LIKE ?
      OR orders.status LIKE ?

    ORDER BY orders.id DESC
    LIMIT 10
    `,
    [search, search, search, search],
  );

  return result;
};
// Update order status
export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus,
) => {
  const database = await getDatabase();

  await database.runAsync(
    `
    UPDATE orders
    SET status = ?
    WHERE id = ?
    `,
    status,
    orderId,
  );
};

export const getOrdersByCustomerId = async (
  customerId: number,
): Promise<OrderWithCustomer[]> => {
  const database = await getDatabase();

  const orders = await database.getAllAsync<OrderWithCustomer>(
    `
    SELECT
      orders.id,
      orders.order_code,
      orders.customer_id,
      orders.service_id,
      orders.status,
      orders.amount,
      orders.delivery_date,
      orders.created_at,

      customers.first_name AS customerName,
      customers.phone AS customerPhone

    FROM orders

    LEFT JOIN customers
      ON orders.customer_id = customers.id

    WHERE orders.customer_id = ?

    ORDER BY orders.id DESC
    `,
    customerId,
  );

  console.log("Orders for customer:", customerId, orders);

  return orders;
};
