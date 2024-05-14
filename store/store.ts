import { configureStore } from "@reduxjs/toolkit";
import countGiohang from "./countGioHang";

export default configureStore({
  reducer: {
    counter: countGiohang,
  },
});
