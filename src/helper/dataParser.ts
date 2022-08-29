import { TRowsData } from "../api/data";

export const getColumnData = (data: TRowsData) => {
  return data.length !== 0 ? Object.keys(data[0]) : []
};

export const getRowData = (data: TRowsData) => {
  return data.length !== 0 ? data : [];
};