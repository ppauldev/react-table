import { createContext, useContext } from "react";

import * as DATA_TYPES from "../api/data.types";

type TPaginationSettings = {
  page: number;
  pageSize: number;
  setPage: (nextPage: number) => void;
  count: number;
};

type TSettingsContext = {
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

export const ColumnContext = createContext<{ columns: DATA_TYPES.TColumnsData, sortColumn: (columnLabel: string) => void } | undefined>(undefined);
export const RowContext = createContext<DATA_TYPES.TRowsData | undefined>(undefined);
export const PaginationContext = createContext<TPaginationSettings | undefined>(undefined);
export const SettingsContext = createContext<TSettingsContext | undefined>(undefined);

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

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error("useSettingsContext was used outside its provider");
  }

  return context;
};