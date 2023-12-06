import { useState, useEffect } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const FilamentDashboard = () => {
  const { getToken } = useKindeAuth();
  const [filamentData, setFilamentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFilamentData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await getToken();
      const response = await fetch("http://localhost:3000/filament-data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setFilamentData(data.data); // Ensure that this matches the response structure from your backend
    } catch (err) {
      setError(err.message);
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilamentData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Filament Data</h2>
      {filamentData && filamentData.length > 0 ? (
        <div>
          {filamentData.map((filament) => (
            <div key={filament.id}>
              <p>Type: {filament.type}</p>
              <p>Color: {filament.color}</p>
              <p>Weight: {filament.weight}</p>
              <p>Temperature: {filament.temperature}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No filament data available.</p>
      )}
    </div>
  );
};

export default FilamentDashboard;
