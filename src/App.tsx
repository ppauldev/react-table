import { memo } from "react";

import * as DATA_TYPES from "./api/data.types";

import { useColumnContext, usePaginationContext, useRowContext } from "./contexts/TableContext";

import { NextIcon, PreviousIcon, SortDownIcon, SortIcon, SortUpIcon } from "./Icons";

import { TableContextProvider } from "./provider/TableContextProvider";

// Style via TailwindUI: https://tailwindui.com/components/application-ui/lists/tables


const App = () => {
  return (
    <div className="app min-h-screen bg-gray-100 text-gray-900">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <h1 className="text-xl px-4">React Table Demo</h1>
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
        {columns.map((column, i) => {
          return (
            <th
              key={i}
              onClick={() => sortColumn(column.label)}
              scope="col"
              className="group px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hover:cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  {column.label}
                </div>
                <div>
                  <span>
                    {column.sortMode !== 0
                      ? column.sortMode !== 1
                        ? <SortDownIcon />
                        : <SortUpIcon />
                      : (
                        <SortIcon />
                      )}
                  </span>
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
  return (
    <>
      {index !== 0 ? (
        <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
          {value}
        </td>
      ) : (
        <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
          <span className="px-4 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm bg-gray-100 text-gray-700 hover:cursor-default">
            {value}
          </span>
        </td>
      )}
    </>
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

export default App;
