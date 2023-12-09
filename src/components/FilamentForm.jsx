import { useState } from "react";
import { useDispatch } from "react-redux";
import { addFilament } from "../slices/filamentSlice.jsx";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const FilamentForm = () => {
  const { getToken } = useKindeAuth();
  const dispatch = useDispatch();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilament({ ...filament, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getToken();
    dispatch(addFilament({ filamentData: filament, token }));
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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(filament).map(([key, value]) =>
          key !== "notes" ? (
            <input
              key={key}
              type={key === "startingAmount" ? "number" : "text"}
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={
                key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")
              }
              className="p-2 border border-gray-300 rounded-md"
              required={key === "name" || key === "startingAmount"}
              min={key === "startingAmount" ? "0" : undefined}
            />
          ) : (
            <textarea
              key={key}
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={
                key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")
              }
              className="p-2 border border-gray-300 rounded-md"
            />
          )
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Filament
        </button>
      </div>
    </form>
  );
};

export default FilamentForm;
