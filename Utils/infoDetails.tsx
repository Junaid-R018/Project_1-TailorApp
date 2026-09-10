export interface Measurement {
  id: number;
  date: string;
  shirtLength: number;
  shoulder: number;
  chest: number;
  sleeve: number;
  waist: number;
  ShalwarLength: number;
}

export interface Order {
  id: number;
  date: string;
  orderNumber: string;
  status: "Pending" | "Completed" | "New Booking";
  total: number;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  measurements: Measurement[];
  orders: Order[];
}
