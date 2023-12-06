import { useEffect, useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const ApiCall = () => {
  const { isLoading, getToken } = useKindeAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("Failed to retrieve token");
        }

        const response = await fetch("http://localhost:3000/some-route", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.message); // Set error state
      }
    };

    fetchData();
  }, [getToken]); // Dependency on getToken

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error
  }

  return (
    <div>
      API Call
      {data && <div>{JSON.stringify(data, null, 2)}</div>} {/* Display data */}
    </div>
  );
};

export default ApiCall;
