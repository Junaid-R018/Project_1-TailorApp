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
    image: require("../assets/images/dp.png"),
    date: "10 Sep 2026",
    amount: 2500,
    status: "New",
  },
  // {
  //   id: "2",
  //   customerId: "CUS-002",
  //   customerName: "Ahmed Khan",
  //   image: require("../assets/images/dp.png"),
  //   date: "09 Sep 2026",
  //   amount: 3500,
  //   status: "Pending",
  // },
  // {
  //   id: "3",
  //   customerId: "CUS-003",
  //   customerName: "Usman Raza",
  //   image: require("../assets/images/dp.png"),
  //   date: "08 Sep 2026",
  //   amount: 1800,
  //   status: "Ready",
  // },
  // {
  //   id: "4",
  //   customerId: "CUS-004",
  //   customerName: "Hassan Ahmed",
  //   image: require("../assets/images/dp.png"),
  //   date: "07 Sep 2026",
  //   amount: 4200,
  //   status: "Delivered",
  // },
  // {
  //   id: "5",
  //   customerId: "CUS-005",
  //   customerName: "Bilal Shah",
  //   image: require("../assets/images/dp.png"),
  //   date: "06 Sep 2026",
  //   amount: 2200,
  //   status: "Cancelled",
  // },
];
