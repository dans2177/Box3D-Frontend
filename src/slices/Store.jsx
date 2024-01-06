import { configureStore } from "@reduxjs/toolkit";
import filamentReducer from "./filamentSlice.jsx";
import themeReducer from "./themeSlice.jsx";


export const store = configureStore({
  reducer: {
    filament: filamentReducer,
    theme: themeReducer,
  },
});
