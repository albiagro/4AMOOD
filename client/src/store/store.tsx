import { configureStore } from "@reduxjs/toolkit";
import auth from "./reducers/auth"

export const store = configureStore({
    reducer: {auth},
  })