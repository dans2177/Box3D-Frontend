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

// Update filament
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

// Modify addFilament action creator
export const addFilament = createAsyncThunk(
  "filament/addFilament",
  async ({ filamentData, token }, { dispatch }) => {
    try {
      const response = await fetch("http://localhost:3000/filament-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filamentData),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error("Error adding filament");
      }

      const responseData = await response.json();
      console.log(responseData); // Debug log

      if (responseData.filament && responseData.filament._id) {
        dispatch(fetchFilaments(token)); // Dispatch a "filament refresh" action to update the state
        return responseData.filament;
      } else {
        throw new Error("Invalid response from the backend");
      }
    } catch (error) {
      console.error("Error adding filament:", error);
      throw error; // Re-throw the error to handle it in your component
    }
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
    return response.json(); // Return the ID of the deleted filament
  }
);

// Get Single Filament
export const getSingleFilament = createAsyncThunk(
  "filament/getSingleFilament",
  async ({ filamentId, token }, { getState }) => {
    const state = getState();
    const existingFilament = state.filament.items.find(
      (f) => f._id === filamentId
    );
    if (existingFilament) {
      return existingFilament;
    }

    const response = await fetch(
      `http://localhost:3000/filament-data/${filamentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error fetching single filament");
    }

    return response.json();
  }
);

// Create Subtraction
export const createSubtraction = createAsyncThunk(
  "filament/createSubtraction",
  async ({ filamentId, subtractionAmount, token }) => {
    const subtractionData = {
      subtractionLength: Number(subtractionAmount),
    };

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

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Unable to create subtraction");
    }

    return { filamentId, newSubtraction: data.newSubtraction };
  }
);

// Get Subtractions
export const getSubtractions = createAsyncThunk(
  "filament/getSubtractions",
  async ({ filamentId, token }) => {
    const response = await fetch(
      `http://localhost:3000/filament-data/${filamentId}/subtraction`,
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
      `http://localhost:3000/filament-data/${filamentId}/subtraction/${subtractionId}`,
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
      `http://localhost:3000/filament-data/${filamentId}/subtraction/${subtractionId}`,
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
        state.items = action.payload.data;
      })
      .addCase(fetchFilaments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addFilament.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addFilament.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload); // Add the new filament to the state
      })
      .addCase(addFilament.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteFilament.fulfilled, (state, action) => {
        const deletedFilamentId = action.payload.filamentId; // Make sure the payload contains filamentId
        state.items = state.items.filter(
          (filament) => filament._id !== deletedFilamentId
        );
      })
      .addCase(updateFilament.fulfilled, (state, action) => {
        const updatedFilament = action.payload;
        const index = state.items.findIndex(
          (f) => f._id === updatedFilament._id
        );
        if (index !== -1) {
          // Replace the entire filament object at the found index with the updated one
          state.items[index] = updatedFilament;
        }
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
        const { filamentId, newSubtraction } = action.payload;
        const index = state.items.findIndex((f) => f._id === filamentId);

        if (index !== -1) {
          state.items[index].subtractions.push(newSubtraction);

          // Recalculate the currentAmount
          const totalSubtractedLength = state.items[index].subtractions.reduce(
            (total, subtraction) => total + subtraction.subtractionLength,
            0
          );
          state.items[index].currentAmount =
            state.items[index].startingAmount - totalSubtractedLength;
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
