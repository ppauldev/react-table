import { memo, useState } from "react";
import { dataLength } from "./api/data";

import * as DATA_TYPES from "./api/data.types";

import { useColumnContext, usePaginationContext, useRowContext, useSettingsContext } from "./contexts/TableContext";

import { NextIcon, PreviousIcon, SettingsIcon, SortDownIcon, SortIcon as DefaultSortIcon, SortUpIcon } from "./Icons";
import { SettingsContextProvider } from "./provider/SettingsContextProvider";

import { TableContextProvider } from "./provider/TableContextProvider";

// Style via TailwindUI: https://tailwindui.com/components/application-ui/lists/tables

const widths: { [key: number]: string } = {
  0: "10%",
  1: "10%",
  2: "30%",
  3: "30%",
  4: "20%"
};

const App = () => {
  return (
    <SettingsContextProvider>
      <div className="app min-h-screen bg-gray-100 text-gray-900">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Header />
          <div className="mt-4">
            <div className="mt-2 flex flex-col">
              <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <Table />
                </div>
              </div>
            </div>
          </div>
        </main >
      </div >
    </SettingsContextProvider>
  );
};

const Header = () => {
  const { setShowModal } = useSettingsContext();

  return (
    <div className="flex flex-row justify-between">
      <h1 className="text-xl mx-4">React Table Demo</h1>
      <div className="mx-4 hover:cursor-pointer" onClick={() => setShowModal(true)}>
        <SettingsIcon />
      </div>
    </div>
  );
};

const Table = () => {
  return (
    <TableContextProvider>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHead />
          <TableBody />
        </table>
        <Pagination />
      </div>
    </TableContextProvider>
  );
};

const TableHead = () => {
  const { columns, sortColumn } = useColumnContext();

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column, index) => {
          return (
            <th
              key={index}
              onClick={() => sortColumn(column.label)}
              scope="col"
              className="group py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hover:cursor-pointer"
              style={{ width: `${widths[index]}` }}
            >
              <div className={`flex items-start w-full ${index !== columns.length - 1 ? "border border-l-0 border-y-0 border-r-slate-200" : ""}`}>
                <div className="px-1">
                  <span>
                    <SortIcon sortMode={column.sortMode} />
                  </span>
                </div>
                <div className="px-2">
                  {column.label}
                </div>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

const TableBody = () => {
  const rows = useRowContext();

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {rows.map((row, i) => <TableRow key={i} {...row} />)}
    </tbody>
  );
};

const TableRow = (rowProps: DATA_TYPES.TRowData) => {
  return (
    <tr>
      {Object.values(rowProps).map((value, i) => <TableCell key={i} value={value} index={i} />)}
    </tr>
  );
};

const TableCell = memo(({ value, index }: { value: string, index: number }) => {
  if (index === 0) {
    return (
      <td className="py-4 text-center text-sm break-words" style={{ width: `${widths[index]}` }}>
        <span className="px-4 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm bg-gray-100 text-gray-700 hover:cursor-default">
          {value}
        </span>
      </td>
    );
  }

  if (index === 1) {
    return (
      <td className="py-4 text-center text-sm break-words" style={{ width: `${widths[index]}` }}>
        {value}
      </td>
    );
  }

  return (
    <td className="px-1 py-4 text-left text-sm break-words" style={{ width: `${widths[index]}` }}>
      {value}
    </td>
  );
});

const Pagination = () => {
  return (
    <section id="pagination" className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <PageLabel />
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <PreviousButton />
            <PageButtons />
            <NextButton />
          </nav>
        </div>
      </div>
    </section>
  );
};

const NextButton = () => {
  const { page, pageSize, setPage, count } = usePaginationContext();

  return (
    <button
      onClick={() => setPage(page + 1)}
      disabled={page + 1 > (Math.ceil(count / pageSize) * pageSize) / pageSize}
      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${page + 1 <= (Math.ceil(count / pageSize) * pageSize) / pageSize ? "hover:bg-gray-50" : "disabled:opacity-75 cursor-not-allowed"}`}
    >
      <NextIcon />
    </button>
  );
};

const PageButtons = () => {
  const { page, pageSize, setPage, count } = usePaginationContext();

  return (
    <>
      {[...Array((Math.ceil(count / pageSize) * pageSize) / pageSize)].map((_, i) => {
        const activeProps = { "aria-current": "page", "className": "z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium" };
        const passiveProps = { "className": "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium" };
        const styleProps = i + 1 === page ? activeProps : passiveProps;

        return (
          <button key={i} onClick={() => setPage(i + 1)} {...styleProps}> {i + 1} </button>
        );
      })}
    </>
  );
};

const PageLabel = () => {
  const { page, pageSize, count } = usePaginationContext();

  return (
    <p className="text-sm text-gray-700">
      Showing
      <span className="font-medium"> {page === 1 ? page : ((page - 1) * pageSize) + 1} </span>
      to
      <span className="font-medium"> {page === 1 ? pageSize : ((page - 1) * pageSize) + pageSize} </span>
      of
      <span className="font-medium"> {count} </span>
      results
    </p>
  );
};

const PreviousButton = () => {
  const { page, setPage } = usePaginationContext();

  return (
    <button
      onClick={() => setPage(page - 1)}
      disabled={page === 1}
      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${page !== 1 ? "hover:bg-gray-50" : "disabled:opacity-75 cursor-not-allowed"} `}
    >
      <PreviousIcon />
    </button>
  );
};

const SortIcon = ({ sortMode }: { sortMode: number }) => {
  if (sortMode !== 0 && sortMode !== 1) return <SortDownIcon />;
  if (sortMode !== 0 && sortMode === 1) return <SortUpIcon />;

  return <DefaultSortIcon />;
};

export const SettingsModal = () => {
  const { pageSize, setPageSize, setShowModal } = useSettingsContext();
  const [localPageSize, setLocalPageSize] = useState(pageSize ?? 0);

  const handleClickApply = () => {
    setPageSize(localPageSize);
    setShowModal(false);
  };

  const handleClickCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-1/3 sm:max-w-lg">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 sm:mx-0 sm:h-10 sm:w-10">
                  <div className="h-6 w-6 text-slate-600">
                    <SettingsIcon />
                  </div>
                </div>
                <div className="mt-3 text-center sm:mt-2 sm:ml-6 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">Settings</h3>
                  <div className="mt-4 mb-2">
                    <div>
                      <label htmlFor="rows" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Results per page</label>
                      <input type="number" id="rows" min="10" max={dataLength} value={localPageSize} onChange={(event) => setLocalPageSize(parseInt(event.target.value))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button type="button" onClick={handleClickApply} className={`inline-flex w-full justify-center rounded-md border border-transparent bg-slate-600 px-4 py-2 text-base font-medium text-white shadow-sm ${!(localPageSize < 10 || localPageSize > dataLength) ? "hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2" : ""} sm:ml-3 sm:w-auto sm:text-sm`} disabled={localPageSize < 10 || localPageSize > dataLength}>Apply</button>
              <button type="button" onClick={handleClickCancel} className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
