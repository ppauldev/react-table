import { TRowsData } from "../api/data";

export const getColumnData = (data: TRowsData) => {
  return data.length !== 0 ? Object.keys(data[0]) : []
};

export const getRowData = (data: TRowsData, page: number, pageSize: number) => {
  const start = page === 1 ? page - 1 : (page - 1) * pageSize;
  const end = page * pageSize;

  return data.length !== 0 ? data.slice(start, end) : [];
};