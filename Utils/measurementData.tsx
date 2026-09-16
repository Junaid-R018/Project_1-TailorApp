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
    title: "shirt",
    fields: [
      { key: "collar", label: "collar" },
      { key: "sleeves", label: "sleeves" },
      { key: "chest", label: "chest" },
      { key: "width", label: "width" },
      { key: "shoulder", label: "shoulder" },
      { key: "shirtLength", label: "shirtLength" },
      { key: "armhole", label: "armhole" },
      { key: "cuff", label: "cuff" },
      { key: "bicep", label: "bicep" },
    ],
  },

  {
    key: "pant",
    title: "pant",
    fields: [
      { key: "waist", label: "waist" },
      { key: "hip", label: "hip" },
      { key: "thigh", label: "thigh" },
      { key: "knee", label: "knee" },
      { key: "bottom", label: "bottom" },
      { key: "length", label: "length" },
    ],
  },

  {
    key: "trouser",
    title: "trouser",
    fields: [
      { key: "waist", label: "waist" },
      { key: "hip", label: "hip" },
      { key: "thigh", label: "thigh" },
      { key: "knee", label: "knee" },
      { key: "bottom", label: "bottom" },
      { key: "length", label: "length" },
    ],
  },

  {
    key: "shalwar",
    title: "shalwar",
    fields: [
      { key: "shalwarLength", label: "shalwarLength" },
      { key: "pancha", label: "pancha" },
      { key: "bottom", label: "bottom" },
    ],
  },

  {
    key: "kameez",
    title: "kameez",
    fields: [
      { key: "ban", label: "ban" },
      { key: "collar", label: "collar" },
      { key: "chest", label: "chest" },
      { key: "width", label: "width" },
      { key: "shoulder", label: "shoulder" },
      { key: "bicep", label: "bicep" },
      { key: "sleeves", label: "sleeves" },
      { key: "kameezLength", label: "kameezLength" },
      { key: "armhole", label: "armhole" },
      { key: "cuff", label: "cuff" },
    ],
  },

  {
    key: "waistcoat",
    title: "waistcoat",
    fields: [
      { key: "chest", label: "chest" },
      { key: "waist", label: "waist" },
      { key: "shoulder", label: "shoulder" },
      { key: "length", label: "length" },
      { key: "armhole", label: "armhole" },
    ],
  },

  {
    key: "others",
    title: "others",
    fields: [
      {
        key: "notes",
        label: "tailorNotes",
      },
    ],
  },
];
