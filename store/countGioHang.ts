import { createSlice } from "@reduxjs/toolkit";
export const countGiohang = createSlice({
  name: "countGioHang",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});
export const { increment, decrement } = countGiohang.actions;
export default countGiohang.reducer;
