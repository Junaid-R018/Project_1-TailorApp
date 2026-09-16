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
