// In filamentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFilaments = createAsyncThunk(
  "filament/fetchFilaments",
  async (token) => {
    const response = await fetch(`http://localhost:3000/filament-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    return data;
  }
);

export const addFilament = createAsyncThunk(
  "filament/addFilament",
  async ({ filamentData, token }) => {
    const response = await fetch("http://localhost:3000/filament-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(filamentData),
    });

    const data = await response.JSON();
    return data;
  }
);

const filamentSlice = createSlice({
  name: "filament",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilaments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFilaments.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched filaments to the array
        state.items = action.payload.data;
      })
      .addCase(fetchFilaments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addFilament.fulfilled, (state, action) => {
        // Handle the successful addition of a filament
        state.items.push(action.payload);
      })
      .addCase(addFilament.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default filamentSlice.reducer;
