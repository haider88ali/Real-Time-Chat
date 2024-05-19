import React, { useEffect, useState } from 'react'
import { Listheader } from '../commons/Listheader'
import { useDispatch, useSelector } from 'react-redux';
import { retrieveEmployees, DeleteEmployee } from '../../redux/slices/EmployeeSlice';
import { StudentPartial } from './StudentPartial';
import Loader from '../commons/Loader';
export const Students = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [status,setStatus]=useState();
  const employees = useSelector((state) => state.employees)
  const getStudents = async (search='') => {
    try {
      setLoading(true);
      // Dispatch your fetch action
      await dispatch(retrieveEmployees({ url: "employees", method: "get", data: {}, query: search })
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };
  const dataFilter = (val) => {
setStatus(val); 
getStudents(val);
}
  useEffect(() => {
    getStudents();

    console.log("employees", employees);
  }, [])
  if (loading) {
    return <Loader />
  }
  return (
    <>
      <Listheader show="true" onChangeSearch={(event) => dataFilter(event.target.value)} searchValue={status}/>
                <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-3 px-4">

          {employees.map((emp) => (
            <StudentPartial data={emp} />
          ))}
        </div>
      
    </>
  )
}
