import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { TColumnsData, TRowsData } from "../api/data";
import { fetchData } from "../api/dataFetcher";
import { getColumnData, getRowData } from "../helper/dataParser";
import { LoadingIcon } from "../Icons";

const ColumnContext = createContext<TColumnsData | undefined>(undefined);
const RowContext = createContext<TRowsData | undefined>(undefined);

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

export const TableContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [columnData, setColumnData] = useState<TColumnsData | []>([]);
  const [rowData, setRowData] = useState<TRowsData | []>([]);
  const { isLoading, error, data } = useQuery(['data'], () => fetchData());

  useEffect(() => {
    if (!data) return;

    setColumnData(getColumnData(data));
    setRowData(getRowData(data));
  }, [data]);

  if (isLoading) return <LoadingIcon />;

  return (
    <ColumnContext.Provider value={columnData} >
      <RowContext.Provider value={rowData}>
        {children}
      </RowContext.Provider>
    </ColumnContext.Provider>
  );
};
