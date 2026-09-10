import { Customer } from "./infoDetails";

export const customer: Customer[] = [
  {
    id: 1,
    name: "Muhammad Ali",
    phone: "0312-3456789",
    address: "Model Town, Lahore",
    measurements: [
      {
        id: 1,
        date: "2026-09-01",
        shirtLength: 40,
        shoulder: 18,
        chest: 40,
        sleeve: 24,
        waist: 38,
        ShalwarLength: 40,
      },
      {
        id: 2,
        date: "2026-08-01",
        shirtLength: 39,
        shoulder: 18,
        chest: 39,
        sleeve: 23,
        waist: 37,
        ShalwarLength: 37,
      },
    ],
    orders: [
      {
        id: 1,
        date: "2026-09-01",
        orderNumber: "ORD-001",
        status: "Pending",
        total: 2500,
      },
      {
        id: 2,
        date: "2026-08-15",
        orderNumber: "ORD-002",
        status: "Completed",
        total: 4000,
      },
    ],
  },
  {
    id: 2,
    name: "Ahmad Raza",
    phone: "0312-3456789",
    address: "Model Town, Gujranwala",
    measurements: [
      {
        id: 1,
        date: "2026-09-05",
        shirtLength: 40,
        shoulder: 18,
        chest: 40,
        sleeve: 24,
        waist: 42,
        ShalwarLength: 40,
      },
      {
        id: 2,
        date: "2025-08-08",
        shirtLength: 39,
        shoulder: 18,
        chest: 39,
        sleeve: 23,
        waist: 40,
        ShalwarLength: 37,
      },
    ],
    orders: [
      {
        id: 1,
        date: "2026-09-05",
        orderNumber: "ORD-001",
        status: "Pending",
        total: 2500,
      },
      {
        id: 2,
        date: "2025-08-08",
        orderNumber: "ORD-002",
        status: "Completed",
        total: 4000,
      },
    ],
  },
];
