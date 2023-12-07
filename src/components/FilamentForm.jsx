import React, { useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const FilamentDashboard = () => {
  const { getToken } = useKindeAuth(); // Assuming you have useKindeAuth hook for authentication

  const [formData, setFormData] = useState({
    name: "",
    color: "",
    manufacturer: "",
    material: "",
    startingAmount: 0,
    // Add other fields as necessary
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reusable change handler for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Form submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await getToken();
      const response = await fetch("http://localhost:3000/filament-data/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Handle response here, maybe update state or redirect user
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      console.error("Error submitting form:", err);
    }
  };

  // Form rendering
  return (
    <div>
      <h2>Add Filament</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Color:</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Manufacturer:</label>
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Material:</label>
          <input
            type="text"
            name="material"
            value={formData.material}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Starting Amount:</label>
          <input
            type="number"
            name="startingAmount"
            value={formData.startingAmount}
            onChange={handleChange}
          />
        </div>
        {/* Add more input fields as needed */}
        <button type="submit">Add Filament</button>
      </form>
    </div>
  );
};

export default FilamentDashboard;
