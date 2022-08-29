import { createContext, useContext, useEffect, useState } from "react";

const App = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>1</th>
          <th>2</th>
          <th>3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>A</td>
          <td>B</td>
          <td>C</td>
        </tr>
        <tr>
          <td>D</td>
          <td>E</td>
          <td>F</td>
        </tr>
        <tr>
          <td>G</td>
          <td>H</td>
          <td>I</td>
        </tr>
      </tbody>
    </table>
  );
};

type TColumnsData = string[];
type TRowData = {
  "1": string;
  "2": string;
  "3": string;
};
type TRowsData = TRowData[];

const ColumnContext = createContext<TColumnsData | undefined>(undefined);
const RowContext = createContext<TRowsData | undefined>(undefined);

const useColumnContext = () => {
  const context = useContext(ColumnContext);

  if (context === undefined) {
    throw new Error("useColumnContext was used outside its provider");
  }

  return context;
};

const useRowContext = () => {
  const context = useContext(RowContext);

  if (context === undefined) {
    throw new Error("useRowContext was used outside its provider");
  }

  return context;
};

const TableContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [columnData, setColumnData] = useState([]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    //
  }, []);

  return (
    <ColumnContext.Provider value={columnData}>
      <RowContext.Provider value={rowData}>
        {children}
      </RowContext.Provider>
    </ColumnContext.Provider>
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
