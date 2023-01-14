export type TColumn = {
  label: string;
  sortMode: number;
};

export type TColumnsData = TColumn[];

export type TRowData = {
  "band": string;
  "label": string;
  "rank": string;
  "title": string;
  "year": string;
};

export type TRowsData = TRowData[];
