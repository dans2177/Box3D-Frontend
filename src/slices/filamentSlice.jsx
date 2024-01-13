// In filamentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//Fetch All User Filaments
export const fetchFilaments = createAsyncThunk(
  "filament/fetchFilaments",
  async (token) => {
    const response = await fetch(`http://localhost:3000/filament-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }
);

// Update User Filament
export const updateFilament = createAsyncThunk(
  "filament/updateFilament",
  async ({ filamentData, token }) => {
    // Add { dispatch }
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

    if (!response.ok) {
      throw new Error("Error updating filament");
    }

    const updatedFilament = await response.json();

    return updatedFilament;
  }
);

// Create User Filament
export const addFilament = createAsyncThunk(
  "filament/addFilament",
  async ({ filamentData, token }) => {
    try {
      const response = await fetch("http://localhost:3000/filament-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filamentData),
      });

      if (!response.ok) {
        throw new Error("Error adding filament");
      }

      const responseData = await response.json();

      if (responseData.filament && responseData.filament._id) {
        return responseData.filament;
      } else {
        throw new Error("Invalid response from the backend");
      }
    } catch (error) {
      return error.message;
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

export const getSingleFilament = createAsyncThunk(
  "filament/getSingleFilament",
  async ({ filamentId, token }, { getState, rejectWithValue }) => {
    const state = getState();
    const existingFilament = state.filament.items.find(
      (f) => f._id === filamentId
    );

    // Return existing filament if found in state
    if (existingFilament) {
      return existingFilament;
    }

    // Fetch the specific filament by ID if not in state
    try {
      const response = await fetch(
        `http://localhost:3000/filaments/${filamentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response is valid
      if (!response.ok) {
        throw new Error(
          `Failed to fetch filament: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data; // Assuming the response data is the filament object
    } catch (error) {
      // Use rejectWithValue to handle errors in createAsyncThunk
      return rejectWithValue(error.message || "Error fetching filament");
    }
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

// Delete Subtraction
export const deleteSubtraction = createAsyncThunk(
  "filament/deleteSubtraction",
  async ({ filamentId, subtractionId, token }, { dispatch }) => {
    const response = await fetch(
      `http://localhost:3000/filament-data/${filamentId}/subtraction/${subtractionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error deleting subtraction");
    }

    // Dispatch getSingleFilament to refresh the SingleFilament page
    dispatch(getSingleFilament({ filamentId, token }));

    return { filamentId, subtractionId };
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
        state.items?.push(action.payload);
      })
      .addCase(addFilament.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteFilament.fulfilled, (state, action) => {
        const deletedFilamentId = action.payload.filamentId;
        state.items = state.items.filter(
          (filament) => filament._id !== deletedFilamentId
        );
      })
      .addCase(updateFilament.fulfilled, (state, action) => {
        const updatedFilament = action.payload;
        const filamentIndex = state.items.findIndex(
          (f) => f._id === updatedFilament._id
        );
        if (filamentIndex !== -1) {
          state.items[filamentIndex] = updatedFilament;
          state.items[filamentIndex].subtractions =
            state.items[filamentIndex].subtractions || [];
          const totalSubtractedLength = updatedFilament.subtractions.reduce(
            (total, subtraction) => total + subtraction.subtractionLength,
            0
          );
          state.items[filamentIndex].currentAmount =
            updatedFilament.startingAmount - totalSubtractedLength;
        }
      })
      .addCase(getSingleFilament.fulfilled, (state, action) => {
        const updatedFilament = action.payload;
        const existingFilamentIndex = state.items.findIndex(
          (f) => f._id === updatedFilament._id
        );
        if (existingFilamentIndex !== -1) {
          state.items[existingFilamentIndex] = updatedFilament;
        } else {
          state.items.push(updatedFilament);
        }
      })
      .addCase(createSubtraction.fulfilled, (state, action) => {
        const { filamentId, newSubtraction } = action.payload;
        const index = state.items.findIndex((f) => f._id === filamentId);
        if (index !== -1) {
          state.items[index].subtractions =
            state.items[index].subtractions || [];
          state.items[index].subtractions.push(newSubtraction);
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
      .addCase(deleteSubtraction.fulfilled, (state, action) => {
        const { filamentId, subtractionId } = action.payload;
        const filamentIndex = state.items.findIndex(
          (f) => f._id === filamentId
        );
        if (filamentIndex !== -1) {
          state.items[filamentIndex].subtractions = state.items[
            filamentIndex
          ].subtractions.filter((s) => s._id !== subtractionId);
          const totalSubtractedLength = state.items[
            filamentIndex
          ].subtractions.reduce(
            (total, subtraction) => total + subtraction.subtractionLength,
            0
          );
          state.items[filamentIndex].currentAmount =
            state.items[filamentIndex].startingAmount - totalSubtractedLength;
        }
      });
  },
});

export default filamentSlice.reducer;
