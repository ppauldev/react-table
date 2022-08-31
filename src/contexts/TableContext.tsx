import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
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

const ColumnContext = createContext<TColumnsData | undefined>(undefined);
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
  const { isLoading, error, data } = useQuery(['data'], () => fetchData());

  useEffect(() => {
    if (!data) return;

    setColumnData(getColumnData(data));
    setRowData(getRowData(data, page, pageSize));
  }, [data, page, pageSize]);

  if (isLoading) return <LoadingIcon />;
  if (error) return <ErrorAlert />;

  return (
    <ColumnContext.Provider value={columnData} >
      <RowContext.Provider value={rowData}>
        <PaginationContext.Provider value={{ page: page, pageSize: pageSize, setPage: setPage, count: data ? data.length : 0 }}>
          {children}
        </PaginationContext.Provider>
      </RowContext.Provider>
    </ColumnContext.Provider>
  );
};
