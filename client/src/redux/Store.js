import { configureStore } from '@reduxjs/toolkit'
import EmployeeReducer from './slices/EmployeeSlice';
import AuthReducer from './slices/AuthSlice';
const reducer = {
    auth: AuthReducer,
    employees:EmployeeReducer
}

const store = configureStore({
  reducer: reducer,
  devTools: true,
})

export default store;