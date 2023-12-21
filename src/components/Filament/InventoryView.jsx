import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFilaments } from "../../slices/filamentSlice";
import FilamentCard from "./FilamentCard";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import FilamentForm from "./FilamentForm";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const InventoryView = () => {
  const dispatch = useDispatch();
  const filamentState = useSelector((state) => state.filament);
  const { getToken } = useKindeAuth();
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    const fetchTokenAndDispatch = async () => {
      try {
        const token = await getToken();
        dispatch(fetchFilaments(token));
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchTokenAndDispatch();
  }, [dispatch, getToken]);

  const handleBackClick = () => {
    // Use navigate function for navigation
    navigate(-1); // Go back one step in history
  };

  if (filamentState.status === "loading") {
    return <div>Loading...</div>;
  }

  if (filamentState.error) {
    return <div>Error: {filamentState.error}</div>;
  }

  const filamentData = filamentState.items;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <IoIosArrowBack
            size={24}
            className="mr-2 hover:cursor-pointer"
            onClick={handleBackClick}
          />
          <h2 className="text-2xl font-semibold">Filament Inventory</h2>
        </div>
        <FilamentForm />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {/* Use grid classes to create a responsive grid layout */}
        {/* One card per column on small screens, 4 columns on larger screens */}
        {filamentData && Array.isArray(filamentData) ? (
          filamentData.map((filament) => (
            <FilamentCard key={filament._id} filament={filament} />
          ))
        ) : (
          <p>No filaments data available.</p>
        )}
      </div>
    </div>
  );
};

export default InventoryView;
