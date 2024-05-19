import API from "../Api";
import { useEmployeeContext } from "../../context/EmployeesContext";

const EmployeeService = async (url, method, data, action, dispatch) => {
  // const { state, dispatch } = useEmployeeContext();

  const res = await API(url, method, data).then((response) => {

    console.log("res",response.data.data);
    switch (action) {
      case 'get':
        dispatch({ type: 'SET_EMPLOYEES', payload: response.data.data });
      case 'post':
        dispatch({ type: 'ADD_EMPLOYEES', payload: response.data.data });
      case 'put':
        dispatch({ type: 'UPDATE_EMPLOYEES', payload: response.data.data });
    };


  });
}


export default EmployeeService