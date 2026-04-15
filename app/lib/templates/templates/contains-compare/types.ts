export type ContainsCompareItem = {
  title: string;
  description?: string;
};

export type ContainsCompareData = {
  centerImageUrl: string;
  containsHeading: string;
  notContainsHeading: string;
  containsItems: ContainsCompareItem[];
  notContainsItems: ContainsCompareItem[];
};

