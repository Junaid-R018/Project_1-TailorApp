export type OrderStatus =
  | "New"
  | "Pending"
  | "Ready"
  | "Delivered"
  | "Cancelled";

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  image: string;
  date: string;
  amount: number;
  status: OrderStatus;
};

export const orders: Order[] = [
  {
    id: "1",
    customerId: "CUS-001",
    customerName: "Muhammad Ali",
    image: "https://i.pravatar.cc/150?img=12",
    date: "10 Sep 2026",
    amount: 2500,
    status: "New",
  },
  {
    id: "2",
    customerId: "CUS-002",
    customerName: "Ahmed Khan",
    image: "https://i.pravatar.cc/150?img=11",
    date: "09 Sep 2026",
    amount: 3500,
    status: "Pending",
  },
  {
    id: "3",
    customerId: "CUS-003",
    customerName: "Usman Raza",
    image: "https://i.pravatar.cc/150?img=13",
    date: "08 Sep 2026",
    amount: 1800,
    status: "Ready",
  },
  {
    id: "4",
    customerId: "CUS-004",
    customerName: "Hassan Ahmed",
    image: "https://i.pravatar.cc/150?img=14",
    date: "07 Sep 2026",
    amount: 4200,
    status: "Delivered",
  },
  {
    id: "5",
    customerId: "CUS-005",
    customerName: "Bilal Shah",
    image: "https://i.pravatar.cc/150?img=15",
    date: "06 Sep 2026",
    amount: 2200,
    status: "Cancelled",
  },
];
