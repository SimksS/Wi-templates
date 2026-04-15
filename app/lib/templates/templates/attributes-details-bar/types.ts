export type AttributesDetailsItem = {
  title: string;
  description: string;
};

export type AttributesDetailsBarData = {
  attributes: Array<{ iconUrl: string; label: string }>;
  detailsItems: AttributesDetailsItem[];
};

