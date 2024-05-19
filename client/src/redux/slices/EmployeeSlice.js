import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../services/Api";

const initialState = [];

export const createEmployee = createAsyncThunk(
  "employee/create",
  async ({ url, method, formData }) => {
    const res = await Api(url, method, formData);
    return res.data;
  }
);

export const retrieveEmployees = createAsyncThunk(
  "employee/retrieve",
  async ({ url, method, data, query }) => {
    const res = await Api(url, method, data, query);
    return res.data;
  }
);

export const updateEmployee = createAsyncThunk(
  "employee/update",
  async ({ url, method, data }) => {
    const res = await Api(url, method, data);
    return res.data;
  }
);

export const deleteEmployee = createAsyncThunk(
  "employee/delete",
  async ({ url, method, data }) => {
    const res = await Api(url, method, data);
    return res.data;
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.push(action.payload);
        window.location = "/students";
      })
      .addCase(retrieveEmployees.fulfilled, (state, action) => {
        return [...action.payload.data];
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.findIndex(
          (employee) => employee._id === action.payload._id
        );
        state[index] = {
          ...state[index],
          ...action.payload,
        };
        window.location = "/employees";
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        let index = state.findIndex((employee) => employee._id === action.payload._id);
        state.splice(index, 1);
      });
  },
});

const { reducer } = employeeSlice;
export default reducer;
