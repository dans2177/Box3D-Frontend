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
    return response.json(); // Correct usage
  }
);

//update filament
export const updateFilament = createAsyncThunk(
  "filament/updateFilament",
  async ({ filamentData, token }) => {
    const response = await fetch(
      `http://localhost:3000/filament-data/${filamentData._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filamentData),
      }
    );
    return response.json();
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

    const data = await response.json();
    return data;
  }
);

// Delete Filament
export const deleteFilament = createAsyncThunk(
  "filament/deleteFilament",
  async ({ filamentId, token }) => {
    const response = await fetch(
      `http://localhost:3000/filament-data/${filamentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return filamentId; // Return the ID of the deleted filament
  }
);

// Get Single Filament
export const getSingleFilament = createAsyncThunk(
  "filament/getSingleFilament",
  async ({ filamentId, token }) => {
    const response = await fetch(
      `http://localhost:3000/filament-data/${filamentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  }
);

// Create Subtraction
export const createSubtraction = createAsyncThunk(
  "filament/createSubtraction",
  async ({ filamentId, subtractionData, token }) => {
    const response = await fetch(
      `http://localhost:3000/filament-data/${filamentId}/subtraction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subtractionData),
      }
    );
    return response.json();
  }
);

// Get Subtractions
export const getSubtractions = createAsyncThunk(
  "filament/getSubtractions",
  async ({ filamentId, token }) => {
    const response = await fetch(
      `http://localhost:3000/filament-data/${filamentId}/subtractions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  }
);

// Update Subtraction
export const updateSubtraction = createAsyncThunk(
  "filament/updateSubtraction",
  async ({ filamentId, subtractionId, updateData, token }) => {
    const response = await fetch(
      `http://localhost:3000/filament-data/${filamentId}/subtractions/${subtractionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      }
    );
    return response.json();
  }
);

// Delete Subtraction
export const deleteSubtraction = createAsyncThunk(
  "filament/deleteSubtraction",
  async ({ filamentId, subtractionId, token }) => {
    const response = await fetch(
      `http://localhost:3000/filament-data/${filamentId}/subtractions/${subtractionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { filamentId, subtractionId }, response.json(); // Return both IDs for state update
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
        console.log("fetchFilaments payload:", action.payload); // Debug log
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFilaments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addFilament.fulfilled, (state, action) => {
        // Add the new filament to the state
        state.items.push(action.payload);
      })
      .addCase(addFilament.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteFilament.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (filament) => filament._id !== action.payload
        );
      })
      .addCase(getSingleFilament.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (f) => f._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(createSubtraction.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (f) => f._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(getSubtractions.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (f) => f._id === action.meta.arg.filamentId
        );
        if (index !== -1) {
          state.items[index].subtractions = action.payload.subtractions;
        }
      })
      .addCase(updateSubtraction.fulfilled, (state, action) => {
        const filamentIndex = state.items.findIndex(
          (f) => f._id === action.meta.arg.filamentId
        );
        if (filamentIndex !== -1) {
          const subtractionIndex = state.items[
            filamentIndex
          ].subtractions.findIndex(
            (s) => s._id === action.meta.arg.subtractionId
          );
          if (subtractionIndex !== -1) {
            state.items[filamentIndex].subtractions[subtractionIndex] =
              action.payload;
          }
        }
      })
      .addCase(deleteSubtraction.fulfilled, (state, action) => {
        const filamentIndex = state.items.findIndex(
          (f) => f._id === action.meta.arg.filamentId
        );
        if (filamentIndex !== -1) {
          state.items[filamentIndex].subtractions = state.items[
            filamentIndex
          ].subtractions.filter((s) => s._id !== action.meta.arg.subtractionId);
        }
      });
  },
});

export default filamentSlice.reducer;
