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

// Add Filament
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

    // Ensure the _id is set in the payload
    data._id = data._id || ""; // Set it to an empty string if it's undefined

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
    return response.json(); // Return the ID of the deleted filament
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
  async ({ filamentId, subtractionAmount, token }) => {
    // Use subtractionAmount instead of subtractionLength
    try {
      const subtractionData = {
        filamentId: filamentId,
        subtractionLength: Number(subtractionAmount), // Ensure it's a valid number
        // You may include other properties like project if needed
      };

      const response = await fetch(
        `http://localhost:3000/filament-data/${filamentId}/subtraction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(subtractionData), // Send the data as JSON
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to create subtraction");
      }

      // Update the state with the newly added subtraction and updated filament data
      return data;
    } catch (error) {
      console.error("Error creating subtraction:", error);
      throw error;
    }
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
      .addCase(addFilament.fulfilled, (state, action) => {
        // Add the new filament to the state
        state.items.push(action.payload);
        // Make sure the _id is set in the payload
        state.items[state.items.length - 1]._id = action.payload._id;
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
        const { _id, updatedProperty, updatedValue } = action.payload; // Payload should contain _id, updatedProperty, and updatedValue

        // Find the index of the updated filament in the state
        const index = state.items.findIndex((f) => f._id === _id);

        if (index !== -1) {
          // Update the specified property of the filament in the state with the new value
          state.items[index][updatedProperty] = updatedValue;
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
        const { filamentId, subtractionData } = action.meta.arg;
        const index = state.items.findIndex((f) => f._id === filamentId);

        if (index !== -1) {
          const filament = state.items[index];
          filament.subtractions.push(subtractionData);

          // Calculate the new currentAmount
          const newCurrentAmount =
            filament.startingAmount -
            filament.subtractions.reduce(
              (total, sub) => total + sub.subtractionLength,
              0
            );

          filament.currentAmount = newCurrentAmount;
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
