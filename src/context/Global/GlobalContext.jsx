import { createContext, useContext, useReducer } from "react";
import { GlobalReducer } from "./GlobalReducer";
import { GoogleSheet } from "../../API/AuthGoogle";

const OrdenesGoogleSheet = new GoogleSheet({
  sheetId: import.meta.env.VITE_SS_REG106,
  nameSheet: "Ordenes",
  range: `Ordenes!A1:ZZZ`,
  rowHead: 1,
});
const TasksGoogleSheet = new GoogleSheet({
  sheetId: import.meta.env.VITE_SS_REG106,
  nameSheet: "Propuesta",
  range: `Propuesta!A1:ZZZ`,
  rowHead: 1,
});
const SectoresGoogleSheet = new GoogleSheet({
  sheetId: import.meta.env.VITE_SS_SECTORES,
  nameSheet: "Sectores y Subsectores",
  range: `Sectores y Subsectores!A1:ZZZ`,
  rowHead: 1,
});
const EmpleadosGoogleSheet = new GoogleSheet({
  sheetId: import.meta.env.VITE_SS_EMPLEADOS,
  nameSheet: "Registro",
  range: `Registro!A1:ZZZ`,
  rowHead: 1,
});
const CodigosGoogleSheet = new GoogleSheet({
  sheetId: import.meta.env.VITE_SS_CODIGOS,
  nameSheet: "Codigos migración YABU",
  range: `Codigos migración YABU!A1:ZZZ`,
  rowHead: 1,
});
const GlobalContext = createContext();
export const useGlobal = () => useContext(GlobalContext);

export function GlobalProvider({ children }) {
  const initialState = {
    orders: [],
    sectors: { data: [], produccion: [] },
    empleados: [],
    activeModal: null,
    codigos: [],
  };
  const [state, dispatch] = useReducer(GlobalReducer, initialState);
  const handleModalClose = () => {
    dispatch({
      type: "HANDLE_ACTIVE_MODAL",
      payload: null,
    });
  };
  const handleModalShow = (modalId) => {
    dispatch({
      type: "HANDLE_ACTIVE_MODAL",
      payload: modalId,
    });
  };
  const getOrders = async () => {
    const data = await OrdenesGoogleSheet.getData();
    dispatch({
      type: "GET_ORDERS",
      payload: data,
    });
  };
  const getSectors = async () => {
    const data = await SectoresGoogleSheet.getData();
    const sectoresProd = data
      .filter((item) => item.area === "Producción" || item.area === "Servicios")
      .reduce((acc, item) => {
        if (!acc.includes(item.sector)) {
          acc.push(item.sector);
        }
        return acc;
      }, []);
    dispatch({
      type: "GET_SECTORS",
      payload: { data: data, produccion: sectoresProd },
    });
  };
  const getEmpleados = async () => {
    const data = await EmpleadosGoogleSheet.getData();
    const empleadosProd = data.filter(
      (item) => item.area === "Producción" && item.activo === "Sí"
    );
    dispatch({
      type: "GET_EMPLEADOS",
      payload: empleadosProd,
    });
  };
  const postTasks = async (data) => {
    const newTasks = data.tasks.map((item) => {
      item.alias = data.alias;
      item.fecha = data.fecha;
      return item;
    });
    const response = Promise.all(newTasks.map(async (task) => {
        return await TasksGoogleSheet.postData(task);
    }));
    return response
  };
  const getCodigos = async () => {
    const data = await CodigosGoogleSheet.getData();
    dispatch({
      type: "GET_CODIGOS",
      payload: data,
    });
  };
  return (
    <GlobalContext.Provider
      value={{
        orders: state.orders,
        getOrders,
        sectors: state.sectors,
        getSectors,
        empleados: state.empleados,
        getEmpleados,
        postTasks,
        handleModalClose,
        handleModalShow,
        activeModal: state.activeModal,
        codigos: state.codigos,
        getCodigos,
        
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
