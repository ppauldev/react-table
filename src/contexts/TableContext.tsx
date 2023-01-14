import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";

import { TColumnsData, TRowsData } from "../api/data";
import { fetchData } from "../api/dataFetcher";

import { getColumnData, getRowData } from "../helper/dataParser";

import { ErrorAlert, LoadingIcon } from "../Icons";

type TPaginationSettings = {
  page: number;
  pageSize: number;
  setPage: (nextPage: number) => void;
  count: number;
};

const ColumnContext = createContext<{ columns: TColumnsData, sortColumn: (columnLabel: string) => void } | undefined>(undefined);
const RowContext = createContext<TRowsData | undefined>(undefined);
const PaginationContext = createContext<TPaginationSettings | undefined>(undefined);

export const useColumnContext = () => {
  const context = useContext(ColumnContext);

  if (context === undefined) {
    throw new Error("useColumnContext was used outside its provider");
  }

  return context;
};

export const useRowContext = () => {
  const context = useContext(RowContext);

  if (context === undefined) {
    throw new Error("useRowContext was used outside its provider");
  }

  return context;
};

export const usePaginationContext = () => {
  const context = useContext(PaginationContext);

  if (context === undefined) {
    throw new Error("usePaginationContext was used outside its provider");
  }

  return context;
};

export const TableContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [columnData, setColumnData] = useState<TColumnsData | []>([]);
  const [rowData, setRowData] = useState<TRowsData | []>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { isLoading, error, data } = useSWR('data', fetchData);

  const getSortedData = (columnLabel: string, rowData: TRowsData, sortMode: number) => {
    if (sortMode === 0) {
      return rowData.sort((a: { [key: string]: string }, b: { [key: string]: string }) => {
        if (/^\d+$/.test(a[columnLabel]) && /^\d+$/.test(b[columnLabel])) {
          return parseInt(a[columnLabel]) - parseInt(b[columnLabel]);
        } else {
          return a[columnLabel].localeCompare(b[columnLabel]);
        }
      });
    }

    if (sortMode === 1) {
      return rowData.sort((a: { [key: string]: string }, b: { [key: string]: string }) => {
        if (/^\d+$/.test(a[columnLabel]) && /^\d+$/.test(b[columnLabel])) {
          return parseInt(b[columnLabel]) - parseInt(a[columnLabel]);
        } else {
          return b[columnLabel].localeCompare(a[columnLabel]);
        }
      });
    }

    if (sortMode === 2) {
      return getRowData(data ?? [], page, pageSize);
    }

    throw new Error(`Unknown sort mode -> ${sortMode}`);
  };
  const sortColumn = (columnLabel: string) => {
    const columnIndex = columnData.findIndex((col) => col.label === columnLabel);
    if (columnIndex === -1) return;

    const copiedColumnData = JSON.parse(JSON.stringify(columnData));
    const sortMode = copiedColumnData[columnIndex].sortMode;
    copiedColumnData[columnIndex].sortMode = sortMode === 0 ? 1 : sortMode === 1 ? 2 : 0;
    setColumnData(copiedColumnData);

    const copiedRowData: TRowsData = JSON.parse(JSON.stringify(rowData));
    const sortedRowData = getSortedData(columnLabel, copiedRowData, sortMode);
    setRowData(sortedRowData);
  };

  useEffect(() => {
    if (!data) return;

    setColumnData(getColumnData(data));
    setRowData(getRowData(data, page, pageSize));
  }, [data, page, pageSize]);

  if (isLoading) return <LoadingIcon />;
  if (error) return <ErrorAlert />;

  return (
    <ColumnContext.Provider value={{ columns: columnData, sortColumn: sortColumn }} >
      <RowContext.Provider value={rowData}>
        <PaginationContext.Provider value={{ page: page, pageSize: pageSize, setPage: setPage, count: data ? data.length : 0 }}>
          {children}
        </PaginationContext.Provider>
      </RowContext.Provider>
    </ColumnContext.Provider>
  );
};
