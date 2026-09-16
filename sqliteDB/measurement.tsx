import { getDatabase } from "./database";

export type MeasurementRecord = {
  id: number;
  customer_id: number;
  measurements: string;
  unit: "inch" | "cm";
  notes: string | null;
  created_at: string;
};

export const addMeasurement = async (
  customerId: number,
  measurements: Record<string, Record<string, string>>,
  unit: "inch" | "cm",
  notes: string,
) => {
  const database = await getDatabase();

  const result = await database.runAsync(
    `
    INSERT INTO measurements
    (customer_id, measurements, unit, notes, created_at)
    VALUES (?, ?, ?, ?, ?)
    `,
    customerId,
    JSON.stringify(measurements),
    unit,
    notes,
    new Date().toISOString(),
  );

  console.log("Measurement added:", result.lastInsertRowId);

  return result.lastInsertRowId;
};

export const updateMeasurement = async (
  measurementId: number,
  measurements: Record<string, Record<string, string>>,
  unit: "inch" | "cm",
  notes: string,
) => {
  const db = await getDatabase();

  await db.runAsync(
    `
    UPDATE measurements
    SET measurements = ?, unit = ?, notes = ?
    WHERE id = ?
    `,
    JSON.stringify(measurements),
    unit,
    notes,
    measurementId,
  );

  console.log("Measurement updated:", measurementId);
};

export const getCustomerMeasurements = async (
  customerId: number,
): Promise<MeasurementRecord[]> => {
  const db = await getDatabase();

  const rows = await db.getAllAsync<MeasurementRecord>(
    `
    SELECT *
    FROM measurements
    WHERE customer_id = ?
    ORDER BY datetime(created_at) DESC
    `,
    customerId,
  );

  return rows;
};

export const getLatestMeasurement = async (
  customerId: number,
): Promise<MeasurementRecord | null> => {
  const db = await getDatabase();

  const row = await db.getFirstAsync<MeasurementRecord>(
    `
    SELECT *
    FROM measurements
    WHERE customer_id = ?
    ORDER BY datetime(created_at) DESC
    LIMIT 1
    `,
    customerId,
  );

  return row ?? null;
};
