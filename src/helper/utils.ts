import { TRowsData } from "../api/data.types";

export const copy = (data: any) => JSON.parse(JSON.stringify(data));

export const sortAscending = (items: TRowsData, lookupKey: string) => {
  return items.sort((a: { [key: string]: string }, b: { [key: string]: string }) => {
    if (/^\d+$/.test(a[lookupKey]) && /^\d+$/.test(b[lookupKey])) {
      return parseInt(a[lookupKey]) - parseInt(b[lookupKey]);
    } else {
      return a[lookupKey].localeCompare(b[lookupKey]);
    }
  });
};

export const sortDescending = (items: TRowsData, lookupKey: string) => {
  return items.sort((a: { [key: string]: string }, b: { [key: string]: string }) => {
    if (/^\d+$/.test(a[lookupKey]) && /^\d+$/.test(b[lookupKey])) {
      return parseInt(b[lookupKey]) - parseInt(a[lookupKey]);
    } else {
      return b[lookupKey].localeCompare(a[lookupKey]);
    }
  });
};