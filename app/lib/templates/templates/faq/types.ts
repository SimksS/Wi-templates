export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqData = {
  title: string;
  openFirstItems: boolean;
  items: FaqItem[];
};
