import {
  GET_ORDERS,
  GET_SECTORS,
  GET_EMPLEADOS,
  HANDLE_ACTIVE_MODAL,
  GET_CODIGOS
} from "../types";

export const GlobalReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_ORDERS:
      return {
        ...state,
        orders: payload,
      };
    case GET_SECTORS:
      return {
        ...state,
        sectors: payload,
      };
    case GET_EMPLEADOS:
      return {
        ...state,
        empleados: payload,
      };
    case HANDLE_ACTIVE_MODAL:
      return {
        ...state,
        activeModal: payload,
      };
    case GET_CODIGOS:
      return {
       ...state,
        codigos: payload,
      };
    default:
      return state;
  }
};
