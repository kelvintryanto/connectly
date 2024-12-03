import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  roomchat: [],
  loading: false,
  error: "",
};

export const roomchatSlice = createSlice({
  name: "roomchat",
  initialState,
  reducers: {
    fetchPending: (state) => {
      state.loading = true;
      state.roomchat = [];
      state.error = "";
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.roomchat = action.payload;
      state.error = "";
    },
    fetchReject(state, action) {
      state.loading = false;
      state.roomchat = [];
      state.error = action.payload;
    },
  },
});
export const { fetchPending, fetchSuccess, fetchReject } = roomchatSlice.actions;

export const fetchAsync = () => async (dispatch) => {
  try {
    dispatch(fetchPending());
    const { data } = await axios.get("http://localhost:3000/roomchat/total", {
      headers: {
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    });

    dispatch(fetchSuccess(data));
    // console.log(data);
  } catch (error) {
    dispatch(fetchReject(error.message));
  }
};

// Action creators are generated for each case reducer function

export default roomchatSlice.reducer;
