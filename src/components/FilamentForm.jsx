import { useState } from "react";
import { useDispatch } from "react-redux";
import { addFilament } from "../slices/filamentSlice.jsx";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const FilamentForm = () => {
  const [filament, setFilament] = useState({
    name: "",
    color: "",
    manufacturer: "",
    material: "",
    startingAmount: 0,
    notes: "",
    size: "",
    temperature: "",
    isArchived: false,
  });

  const { getToken } = useKindeAuth();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilament({
      ...filament,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getToken();
    console.log(token); // Optional: For debugging purposes

    dispatch(addFilament({ filamentData: filament, token }));

    // Reset form data
    setFilament({
      name: "",
      color: "",
      manufacturer: "",
      material: "",
      startingAmount: 0,
      notes: "",
      size: "",
      temperature: "",
      isArchived: false,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={filament.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="text"
        name="color"
        value={filament.color}
        onChange={handleChange}
        placeholder="Color"
      />
      <input
        type="text"
        name="manufacturer"
        value={filament.manufacturer}
        onChange={handleChange}
        placeholder="Manufacturer"
      />
      <input
        type="text"
        name="material"
        value={filament.material}
        onChange={handleChange}
        placeholder="Material"
      />
      <input
        type="number"
        name="startingAmount"
        value={filament.startingAmount}
        onChange={handleChange}
        placeholder="Starting Amount"
        required
        min="0"
      />
      <textarea
        name="notes"
        value={filament.notes}
        onChange={handleChange}
        placeholder="Notes"
      />
      <input
        type="text"
        name="size"
        value={filament.size}
        onChange={handleChange}
        placeholder="Size"
      />
      <input
        type="text"
        name="temperature"
        value={filament.temperature}
        onChange={handleChange}
        placeholder="Temperature"
      />
      <label>
        Is Archived:
        <input
          type="checkbox"
          name="isArchived"
          checked={filament.isArchived}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Add Filament</button>
    </form>
  );
};

export default FilamentForm;
