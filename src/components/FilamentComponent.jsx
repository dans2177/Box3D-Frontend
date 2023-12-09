import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFilaments } from "../slices/filamentSlice";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import LoadingComponent from "./Loading.jsx";

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
        dispatch(fetchFilaments(token));
        console.log(filaments, filamentStatus);
      }
    };

    fetchTokenAndDispatch();
  }, [filamentStatus, dispatch, getToken, filaments]);

  if (filamentStatus === "loading") {
    return <LoadingComponent />;
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
    <div className="p-4">
      {filaments.data &&
        filaments.data.map((filament) => (
          <div
            key={filament._id}
            className="bg-gray-100 rounded-lg p-4 my-4 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {filament.name}
            </h2>
            {Object.entries(filament).map(([key, value]) => (
              <div key={key} className="text-gray-600 mt-2">
                <span className="font-medium">
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1")}
                </span>
                : <span className="font-light">{value}</span>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};


export default FilamentComponent;
