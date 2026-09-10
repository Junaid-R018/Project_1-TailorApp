export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read?: boolean;
};

export const notifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to Tanposh",
    message: "Your account has been created successfully.",
    time: "Just now",
  },
  {
    id: "2",
    title: "Stay up to date",
    message: "We will notify you about important updates here.",
    time: "Today",
    read: true,
  },
];
