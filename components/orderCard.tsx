// import { useTheme } from "@/app/context/ThemeContext";
// import { Order } from "@/sqliteDB/order";
// import { theme } from "@/styles/theme";
// import { StyleSheet, Text, View } from "react-native";

// interface OrderCardProps {
//   order: Order;
// }

// export default function OrderCard({ order }: OrderCardProps) {
//   const { colors } = useTheme();

//   return (
//     <View
//       style={[
//         styles.card,
//         {
//           backgroundColor: colors.card,
//           borderColor: colors.border,
//         },
//       ]}
//     >
//       <View style={styles.topRow}>
//         <Text
//           style={[
//             styles.orderNumber,
//             {
//               color: colors.text,
//             },
//           ]}
//         >
//           {order.order_code}
//         </Text>

//         <View
//           style={[
//             styles.statusBadge,
//             {
//               backgroundColor: colors.primary,
//             },
//           ]}
//         >
//           <Text
//             style={[
//               styles.status,
//               {
//                 color: colors.secondaryDark,
//               },
//             ]}
//           >
//             {order.status}
//           </Text>
//         </View>
//       </View>
//       <Text
//         style={[
//           styles.date,
//           {
//             color: colors.textSecondary,
//           },
//         ]}
//       >
//         {order.delivery_date
//           ? new Date(order.delivery_date).toLocaleDateString("en-US", {
//               day: "numeric",
//               month: "short",
//               year: "numeric",
//             })
//           : "No delivery date"}
//       </Text>
//       <View style={styles.bottomRow}>
//         {/* <Text
//           style={[
//             styles.item,
//             {
//               color: colors.textSecondary,
//             },
//           ]}
//         >
//           Tailoring Order
//         </Text> */}

//         <Text
//           style={[
//             styles.total,
//             {
//               color: colors.text,
//             },
//           ]}
//         >
//           Rs. {order.amount ?? 0}
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     padding: 14,
//     borderRadius: theme.radius.medium,
//     marginBottom: 10,
//     borderWidth: 1,
//     marginTop: 10,
//     marginHorizontal: 12,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 3,
//   },

//   topRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   orderNumber: {
//     fontSize: theme.font.size.medium,
//     fontWeight: "600",
//   },

//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: theme.radius.round,
//   },

//   status: {
//     fontSize: theme.font.size.small,
//     fontWeight: "600",
//   },

//   date: {
//     marginTop: 6,
//     fontSize: theme.font.size.small,
//   },

//   bottomRow: {
//     marginTop: 14,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   item: {
//     fontSize: theme.font.size.small,
//   },

//   total: {
//     fontSize: theme.font.size.medium,
//     fontWeight: "700",
//   },
// });

import { theme } from "@/styles/theme";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { OrderStatus, OrderWithCustomer } from "@/sqliteDB/order";

interface OrderCardProps {
  order: OrderWithCustomer;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        console.log("Selected order:", order.id);

        // Later you can navigate to order details:
        // router.push(`/orders/${order.id}`);
      }}
    >
      <Image
        source={require("@/assets/images/dp.png")}
        style={styles.customerImage}
      />

      <View style={styles.customerInfo}>
        <Text style={styles.customerName} numberOfLines={1}>
          {order.customerName}
        </Text>

        <Text style={styles.customerId}>Order: {order.order_code}</Text>

        <Text style={styles.orderDate}>
          {new Date(order.created_at).toLocaleDateString("en-GB")}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <StatusBadge status={order.status} />

        <Text style={styles.amount}>Rs. {order.amount.toLocaleString()}</Text>
      </View>
    </Pressable>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <View
      style={[
        styles.statusBadge,

        status === "New" && styles.newStatus,
        status === "Pending" && styles.pendingStatus,
        status === "Ready" && styles.readyStatus,
        status === "Delivered" && styles.deliveredStatus,
        status === "Cancelled" && styles.cancelledStatus,
      ]}
    >
      <Text
        style={[
          styles.statusText,

          status === "New" && styles.newText,
          status === "Pending" && styles.pendingText,
          status === "Ready" && styles.readyText,
          status === "Delivered" && styles.deliveredText,
          status === "Cancelled" && styles.cancelledText,
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.light.textWhite,
    borderRadius: theme.radius.large,
    borderColor: theme.colors.light.border,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },

  customerImage: {
    width: 58,
    height: 58,
    borderRadius: theme.radius.round,
    backgroundColor: "#E8E8E8",
  },

  customerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  customerName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.light.textNavy,
    marginBottom: 3,
  },

  customerId: {
    fontSize: 12,
    color: theme.colors.light.textSecondary,
    marginBottom: 4,
  },

  orderDate: {
    fontSize: 12,
    color: theme.colors.light.textSecondary,
  },

  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  newStatus: {
    backgroundColor: theme.colors.light.primary,
  },

  newText: {
    color: theme.colors.light.textWhite,
  },

  pendingStatus: {
    backgroundColor: "#dd7119",
  },

  pendingText: {
    color: theme.colors.light.textWhite,
  },

  readyStatus: {
    backgroundColor: theme.colors.light.success,
  },

  readyText: {
    color: theme.colors.light.textWhite,
  },

  deliveredStatus: {
    backgroundColor: theme.colors.light.secondaryLight,
  },

  deliveredText: {
    color: theme.colors.light.textWhite,
  },

  cancelledStatus: {
    backgroundColor: theme.colors.light.error,
  },

  cancelledText: {
    color: theme.colors.light.textWhite,
  },

  amount: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.light.text,
  },
});
