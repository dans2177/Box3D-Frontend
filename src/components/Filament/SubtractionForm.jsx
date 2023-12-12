import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createSubtraction } from "../redux/filamentSlice";

const SubtractionForm = ({ filamentId }) => {
  const [subtractionData, setSubtractionData] = useState({
    subtractionLength: "",
    project: "",
    date: "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setSubtractionData({ ...subtractionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createSubtraction({ filamentId, subtractionData }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="number"
        name="subtractionLength"
        value={subtractionData.subtractionLength}
        onChange={handleChange}
        placeholder="Subtraction Length"
        className="w-full p-2 border border-gray-300 rounded"
      />
      {/* Add other input fields similarly */}
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Add Subtraction
      </button>
    </form>
  );
};

export default SubtractionForm;
