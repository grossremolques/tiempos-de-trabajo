import DataTable from "react-data-table-component";
import { useGlobal } from "../context/Global/GlobalContext";

const customStyles = {
  headCells: {
    style: {
      fontSize: "1rem",
      fontWeight: "bold",
    },
  },
  cells: {
    style: {
      fontSize: "0.95rem",
    },
  },
};
const options = {
  rowsPerPageText: "Filas por página",
  rangeSeparatorText: "de",
} 
export default function TableComponent({columns, data}) {
  //const { darkTheme } = useGlobal();
  return (
    <DataTable
      className="custom-element"
      columns={columns}
      data={data}
      customStyles={customStyles}
      pagination
      paginationPerPage={10}
      paginationComponentOptions={options}
      theme={darkTheme ? "dark" : "light"}
      pointerOnHover
      highlightOnHover
    />
  );
}
