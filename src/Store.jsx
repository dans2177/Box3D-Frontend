import { configureStore } from "@reduxjs/toolkit";
import filamentReducer from "./slices/filamentSlice.jsx";

export const store = configureStore({
  reducer: {
    filament: filamentReducer,
  },
});
