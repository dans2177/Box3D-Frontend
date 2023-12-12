import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addFilament, updateFilament } from "../../slices/filamentSlice"; // Import your Redux Toolkit actions
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const FilamentForm = ({ initialData, onSubmit }) => {
  const dispatch = useDispatch();
  const { getToken } = useKindeAuth();

  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      color: "",
      manufacturer: "",
      material: "",
      startingAmount: "",
      notes: "",
      size: "",
      temperature: "",
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken(); // Wait for the token from KindeProvider
      if (initialData) {
        // Dispatch the updateFilament action with the obtained token
        dispatch(updateFilament({ filamentData: formData, token }));
      } else {
        // Dispatch the addFilament action with the obtained token
        dispatch(addFilament({ filamentData: formData, token }));
      }
      onSubmit && onSubmit();
    } catch (error) {
      console.error("Error while obtaining the token:", error);
      // Handle the error here
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Color"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="manufacturer"
          value={formData.manufacturer}
          onChange={handleChange}
          placeholder="Manufacturer"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="material"
          value={formData.material}
          onChange={handleChange}
          placeholder="Material"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="startingAmount"
          value={formData.startingAmount}
          onChange={handleChange}
          placeholder="Starting Amount"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="size"
          value={formData.size}
          onChange={handleChange}
          placeholder="Size"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="temperature"
          value={formData.temperature}
          onChange={handleChange}
          placeholder="Temperature"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {initialData ? "Update" : "Add"} Filament
        </button>
      </form>
    </div>
  );
};

export default FilamentForm;
