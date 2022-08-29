import { TRowData } from "./api/data";
import { TableContextProvider, useColumnContext, useRowContext } from "./contexts/TableContext";

const App = () => {
  return (
    <div className="app">
      <Table />
    </div>
  );
};

const Table = () => {
  return (
    <TableContextProvider>
      <TableHead />
      <TableBody />
    </TableContextProvider>
  );
};

const TableHead = () => {
  const columns = useColumnContext();

  return (
    <thead>
      <tr>
        {columns.map((column, i) => <th key={i}>{column}</th>)}
      </tr>
    </thead>
  );
};

const TableBody = () => {
  const rows = useRowContext();

  return (
    <tbody>
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
    <td>
      {value}
    </td>
  );
};

export default App;
