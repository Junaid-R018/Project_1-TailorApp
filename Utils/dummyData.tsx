export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  status: any;
};

export const servicesData: Service[] = [
  {
    id: "1",
    name: "Shalwar Kameez",
    description: "Complete stitching",
    price: 2500,
    icon: "shirt-outline",
    status: "Pending",
  },
  {
    id: "2",
    name: "Kurta",
    description: "Custom kurta stitching",
    price: 1500,
    icon: "shirt-outline",
    status: "Completed",
  },
  {
    id: "3",
    name: "Pant",
    description: "Trouser stitching",
    price: 1200,
    icon: "body-outline",
    status: "Ready",
  },
  {
    id: "4",
    name: "Waistcoat",
    description: "Custom waistcoat",
    price: 2000,
    icon: "shirt-outline",
    status: "New Booking",
  },
  {
    id: "5",
    name: "Sherwani",
    description: "Wedding sherwani",
    price: 5000,
    icon: "shirt-outline",
    status: "Completed",
  },
];
