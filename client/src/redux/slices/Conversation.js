import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../services/Api";

const initialState = [];

export const createConversation = createAsyncThunk(
  "conversation/create",
  async ({ url, method, formData }) => {
    const res = await Api(url, method, formData);
    return res.data;
  }
);

export const retrieveConversations = createAsyncThunk(
  "conversation/retrieve",
  async ({ url, method, data, query }) => {
    const res = await Api(url, method, data, query);
    return res.data;
  }
);

export const retrieveMesssagesByConversation = createAsyncThunk(
  "conversation/retrieveMessageById",
  async ({ url, method, data, query, params }) => {
    const res = await Api(url, method, data, query, params);
    return res.data;
  }
)

export const sendMesssagesByConversation = createAsyncThunk(
  "conversation/sentMessageById",
  async ({ url, method, data, query }) => {
    const res = await Api(url, method, data, query);
    return res.data;
  }
)
export const getAllUsers = createAsyncThunk(
  "conversation/getUsers",
  async ({ url, method, data, query }) => {
    const res = await Api(url, method, data, query);
    return res.data;
  }
)
const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveConversations.fulfilled, (state, action) => {
        window.location = "/students";
      })
  },
});

const { reducer } = conversationSlice;
export default reducer;
