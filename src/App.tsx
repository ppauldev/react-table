import { TRowData } from "./api/data";
import { TableContextProvider, useColumnContext, useRowContext } from "./contexts/TableContext";

// Style via TailwindUI: https://tailwindui.com/components/application-ui/lists/tables

const App = () => {
  return (
    <div className="app min-h-screen bg-gray-100 text-gray-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <h1 className="text-xl">React Table Demo</h1>
        <div className="mt-4">
          <div className="mt-2 flex flex-col">
            <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <Table />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const Table = () => {
  return (
    <TableContextProvider>
      <table className="min-w-full divide-y divide-gray-200">
        <TableHead />
        <TableBody />
      </table>
    </TableContextProvider>
  );
};

const TableHead = () => {
  const columns = useColumnContext();

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column, i) => <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" key={i}>{column}</th>)}
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

const TableRow = (rowProps: TRowData) => {
  return (
    <tr>
      {Object.values(rowProps).map((value, i) => <TableCell key={i} value={value} />)}
    </tr>
  );
};

const TableCell = ({ value }: { value: string }) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      {value}
    </td>
  );
};

export default App;
