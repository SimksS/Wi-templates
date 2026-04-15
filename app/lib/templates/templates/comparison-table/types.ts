export type ComparisonValue =
  | { kind: "text"; value: string }
  | { kind: "boolean"; value: boolean };

export type ComparisonRow = {
  attribute: string;
  brand: ComparisonValue;
  competitor: ComparisonValue;
};

export type ComparisonTableData = {
  title: string;
  subtitle: string;
  logoUrl: string;
  brandHeaderMode: "text" | "logo";
  brandName: string;
  competitorName: string;
  brandImageUrl: string;
  competitorImageUrl: string;
  rows: ComparisonRow[];
};

