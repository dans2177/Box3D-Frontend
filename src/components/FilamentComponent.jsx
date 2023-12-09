import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFilaments } from "../slices/filamentSlice";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const FilamentComponent = () => {
  const { getToken } = useKindeAuth();
  const dispatch = useDispatch();
  const filaments = useSelector((state) => state.filament.items);
  const filamentStatus = useSelector((state) => state.filament.status);
  const error = useSelector((state) => state.filament.error);

  useEffect(() => {
    const fetchTokenAndDispatch = async () => {
      if (filamentStatus === "idle") {
        const token = await getToken();
        console.log(token); // For debugging
        dispatch(fetchFilaments(token));
      }
    };

    fetchTokenAndDispatch();
  }, [filamentStatus, dispatch, getToken]);

  if (filamentStatus === "loading") {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Check if filaments is defined and if the array is empty
  if (
    filamentStatus === "succeeded" &&
    (!filaments || filaments.length === 0)
  ) {
    return <div>No inventory available.</div>;
  }

  return (
    <div>
      {filaments.map((filament) => (
        <div key={filament._id}>{filament.name}</div>
      ))}
    </div>
  );
};

export default FilamentComponent;
