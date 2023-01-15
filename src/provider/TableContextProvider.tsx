import { useEffect, useState } from "react";
import useSWR from "swr";

import * as DATA_TYPES from "../api/data.types";
import { fetchData } from "../api/dataFetcher";

import { ColumnContext, PaginationContext, RowContext, useSettingsContext } from "../contexts/TableContext";

import { getColumnData, getRowData } from "../helper/dataParser";
import * as UTILS from "../helper/utils";

import { ErrorAlert, LoadingIcon } from "../Icons";

export const TableContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { pageSize } = useSettingsContext();

  const [columnData, setColumnData] = useState<DATA_TYPES.TColumnsData | []>([]);
  const [rowData, setRowData] = useState<DATA_TYPES.TRowsData | []>([]);
  const [page, setPage] = useState<number>(1);

  const { isLoading, error, data } = useSWR('data', fetchData);

  const getSortedData = (columnLabel: string, rowData: DATA_TYPES.TRowsData, sortMode: number) => {
    if (sortMode === 0) {
      return UTILS.sortAscending(rowData, columnLabel);
    }

    if (sortMode === 1) {
      return UTILS.sortDescending(rowData, columnLabel);
    }

    if (sortMode === 2) {
      return getRowData(data ?? [], page, pageSize);
    }

    throw new Error(`Unknown sort mode -> ${sortMode}`);
  };

  const sortColumn = (columnLabel: string) => {
    const columnIndex = columnData.findIndex((col) => col.label === columnLabel);
    if (columnIndex === -1) return;

    const copiedColumnData: DATA_TYPES.TColumnsData = UTILS.copy(columnData);
    const sortMode = copiedColumnData[columnIndex].sortMode;
    copiedColumnData[columnIndex].sortMode = sortMode === 0 ? 1 : sortMode === 1 ? 2 : 0;
    setColumnData(copiedColumnData);

    const copiedRowData: DATA_TYPES.TRowsData = UTILS.copy(rowData);
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
