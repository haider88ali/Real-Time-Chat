import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/Api";
const initialState = [];
export const AuthLogin = createAsyncThunk(
  "auth/login",
  async ({ url, method, data }) => {
    try {
      console.log(url, method, data);
      const response = await API(url, method, data);
      console.log("resdsd", response);
      // toast.success("Added Successfully");
      return response.data;
    } catch (err) {

    }
  }

)
export const CreateUser = createAsyncThunk(
  "auth/create",
  async ({ url, method, data }) => {
    console.log(url, method, data);
    const res = await API(url, method, data);
    return res.data;
  }
);
export const FetchUsers = createAsyncThunk(
  "auth/fetch",
  async ({ url, method, data }) => {
    console.log(url, method, data);
    const res = await API(url, method, data);
    return res.data;
  }
);
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AuthLogin.pending, (state, action) => {
        console.log("pending...");
      })
      .addCase(AuthLogin.fulfilled, (state, action) => {
        return action.payload.data;
        //   if(action.status === 400) {
        //     alert('Invalid credentials')
        // }else{
        //     // const resData = await res.json()
        //     // if(resData.token) {
        //     //     localStorage.setItem('user:token', resData.token)
        //     //     localStorage.setItem('user:detail', JSON.stringify(resData.user))
        //     //     navigate('/')
        //     // }
        // }
      })
    // .addCase(updateEmployee.fulfilled, (state, action) => {
    //   const index = state.findIndex(
    //     (employee) => employee._id === action.payload._id
    //   );
    //   state[index] = {
    //     ...state[index],
    //     ...action.payload,
    //   };
    //   window.location = "/employees";
    // })
    // .addCase(deleteEmployee.fulfilled, (state, action) => {
    //   let index = state.findIndex((employee) => employee._id === action.payload._id);
    //   state.splice(index, 1);
    // });
  },
});

const { reducer } = AuthSlice;

export default reducer;