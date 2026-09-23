import { ImageSourcePropType } from "react-native";

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
  image: ImageSourcePropType;
  date: string;
  amount: number;
  status: OrderStatus;
};

export const orders: Order[] = [
  {
    id: "1",
    customerId: "CUS-001",
    customerName: "Muhammad Ali",
    image: require("../assets/images/profile.png"),
    date: "10 Sep 2026",
    amount: 2500,
    status: "New",
  },
];
