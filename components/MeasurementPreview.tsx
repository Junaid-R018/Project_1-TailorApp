import { theme } from "@/styles/theme";
import { StyleSheet, Text, View } from "react-native";

type MeasurementPreviewProps = {
  measurements: string;
  unit: string;
  serviceName?: string;
};

const formatLabel = (value: string) => {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
};

const MeasurementPreview = ({
  measurements,
  unit,
  serviceName,
}: MeasurementPreviewProps) => {
  let data: Record<string, Record<string, string>> = {};

  const getCategoriesForServices = (serviceName: string) => {
    switch (serviceName.toLocaleLowerCase()) {
      case "shirt":
        return ["shirt"];

      case "pant":
        return ["pant"];

      case "trouser":
        return ["trouser"];

      case "kurta":
        return ["kurta"];
      case "shalwar kameez":
        return ["kameez", "shalwar"];

      case "waistcoat":
        return ["waistcoat"];

      case "other":
        return ["other"];
      default:
        return [];
    }
  };

  try {
    data = JSON.parse(measurements);
  } catch (error) {
    console.log("Failed to parse measurements:", error);
  }

  const categories = serviceName
    ? getCategoriesForServices(serviceName)
    : Object.keys(data);
  console.log("SERVICE NAME:", serviceName);
  console.log("MEASUREMENT DATA:", data);
  console.log("CATEGORIES:", categories);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Latest Measurement</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>

      {categories.map((category) => {
        const fields = data[category];

        console.log("CATEGORY:", category);
        console.log("FIELDS:", fields);
        if (!fields) return null;

        const filledFields = Object.entries(fields).filter(([, value]) =>
          value?.trim(),
        );

        if (filledFields.length === 0) {
          return null;
        }

        return (
          <View key={category} style={styles.section}>
            <Text style={styles.category}>{formatLabel(category)}</Text>

            {filledFields.map(([field, value]) => (
              <View key={field} style={styles.row}>
                <Text style={styles.label}>{formatLabel(field)}</Text>

                <Text style={styles.value}>
                  {value} {unit}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
};

export default MeasurementPreview;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: theme.font.size.medium,
    fontWeight: "700",
  },

  unit: {
    fontSize: theme.font.size.small,
    fontWeight: "600",
  },

  section: {
    marginBottom: 10,
  },

  category: {
    fontSize: theme.font.size.medium,
    fontWeight: "700",
    marginBottom: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  label: {
    fontSize: theme.font.size.small,
  },

  value: {
    fontSize: theme.font.size.small,
    fontWeight: "600",
  },
});
