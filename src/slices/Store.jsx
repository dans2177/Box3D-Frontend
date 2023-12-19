import { configureStore } from "@reduxjs/toolkit";
import filamentReducer from "./filamentSlice.jsx";

export const store = configureStore({
  reducer: {
    filament: filamentReducer,
  },
});
