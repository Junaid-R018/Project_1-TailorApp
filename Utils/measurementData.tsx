export type MeasurementField = {
  key: string;
  label: string;
};

export type MeasurementSection = {
  key: string;
  title: string;
  fields: MeasurementField[];
};

export const measurementSections: MeasurementSection[] = [
  {
    key: "shirt",
    title: "Shirt",
    fields: [
      { key: "collar", label: "Collar" },
      { key: "sleeves", label: "Sleeves" },
      { key: "chest", label: "Chest" },
      { key: "waist", label: "Waist" },
      { key: "shoulder", label: "Shoulder" },
      { key: "shirtLength", label: "Shirt Length" },
      { key: "armhole", label: "Armhole" },
      { key: "cuff", label: "Cuff" },
      { key: "bicep", label: "Bicep" },
    ],
  },

  {
    key: "pant",
    title: "Pant",
    fields: [
      { key: "waist", label: "Waist" },
      { key: "hip", label: "Hip" },
      { key: "thigh", label: "Thigh" },
      { key: "knee", label: "Knee" },
      { key: "bottom", label: "Bottom" },
      { key: "length", label: "Length" },
    ],
  },

  {
    key: "trouser",
    title: "Trouser",
    fields: [
      { key: "waist", label: "Waist" },
      { key: "hip", label: "Hip" },
      { key: "thigh", label: "Thigh" },
      { key: "knee", label: "Knee" },
      { key: "bottom", label: "Bottom" },
      { key: "length", label: "Length" },
    ],
  },

  {
    key: "shalwar",
    title: "Shalwar",
    fields: [
      { key: "waist", label: "Waist" },
      { key: "hip", label: "Hip" },
      { key: "shalwarLength", label: "Shalwar Length" },
      { key: "pancha", label: "Pancha" },
      { key: "bottom", label: "Bottom" },
    ],
  },

  {
    key: "kameez",
    title: "Kameez",
    fields: [
      { key: "chest", label: "Chest" },
      { key: "waist", label: "Waist" },
      { key: "hip", label: "Hip" },
      { key: "shoulder", label: "Shoulder" },
      { key: "sleeves", label: "Sleeves" },
      { key: "kameezLength", label: "Kameez Length" },
      { key: "armhole", label: "Armhole" },
      { key: "cuff", label: "Cuff" },
    ],
  },

  {
    key: "waistcoat",
    title: "Waistcoat",
    fields: [
      { key: "chest", label: "Chest" },
      { key: "waist", label: "Waist" },
      { key: "shoulder", label: "Shoulder" },
      { key: "length", label: "Length" },
      { key: "armhole", label: "Armhole" },
    ],
  },

  {
    key: "others",
    title: "Others",
    fields: [{ key: "notes", label: "Tailor Notes" }],
  },
];
