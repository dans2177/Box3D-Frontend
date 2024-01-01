import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { fetchFilaments } from "../../slices/filamentSlice";
import FilamentCard from "./FilamentCard";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  IoIosArchive,
  IoIosSettings,
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosArrowBack,
  IoIosAdd,
} from "react-icons/io";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../Others/Loading";
import { Tooltip } from "react-tooltip";
import FilamentForm from "./FilamentForm.jsx";

// Selector using reselect for memoization
const selectFilamentItems = createSelector(
  (state) => state.filament.items,
  (items) => (items ? items.map((item) => ({ ...item })) : [])
);

const InventoryView = () => {
  const dispatch = useDispatch();
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();
  const [showArchived, setShowArchived] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showFilamentForm, setShowFilamentForm] = useState(false);

  const openFilamentForm = () => {
    setShowFilamentForm(true);
  };

  const closeFilamentForm = () => {
    setShowFilamentForm(false);
  };

  // Get the filament items and filament state
  const filamentItems = useSelector(selectFilamentItems);
  const filamentState = useSelector((state) => state.filament);

  useEffect(() => {
    const fetchTokenAndDispatch = async () => {
      try {
        const token = await getToken();
        // Check if filaments are already loaded in the state
        if (filamentState.status !== "success") {
          await dispatch(fetchFilaments(token));
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    // Only fetch filaments when the component mounts
    if (!filamentItems.length) {
      fetchTokenAndDispatch();
    }
  }, [dispatch, getToken, filamentItems, filamentState]);

  const handleBackClick = () => {
    navigate("/");
  };

  const toggleCommandCenter = () => {
    setIsOpen(!isOpen);
  };

  const toggleArchived = () => {
    setShowArchived(!showArchived);
  };

  const filamentData = showArchived
    ? filamentItems.filter((filament) => filament.isArchived)
    : filamentItems.filter((filament) => !filament.isArchived);

  if (filamentState.status === "loading") {
    return <LoadingComponent />;
  }

  if (filamentState.error) {
    return <div>Error: {filamentState.error}</div>;
  }

  return (
    <div className="p-4 bg-gray-700 min-h-screen relative pb-20">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="flex items-center">
          <div
            className="inline-flex justify-center items-center rounded-full transition-all p-1 hover:bg-green-900"
            onClick={handleBackClick}
            style={{ margin: "0 10px" }}
          >
            <IoIosArrowBack size={24} className="text-green-700" />
          </div>
          <h2 className="text-2xl font-semibold text-green-700">
            Filament Inventory
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 px-4 lg:px-8 xl:px-16 2xl:px-32">
        {filamentData && Array.isArray(filamentData) ? (
          filamentData.map((filament) => (
            <FilamentCard key={filament._id} filament={filament} />
          ))
        ) : (
          <p>No filaments data available.</p>
        )}
      </div>

      {/* Command Center */}
      <div
        className={`fixed bottom-0 left-0 m-4 bg-gray-800 rounded-lg p-2 flex flex-col items-center ${
          isOpen ? "space-y-2" : ""
        }`}
      >
        <button
          onClick={toggleCommandCenter}
          className="bg-orange-600 hover:bg-orange-700 rounded-full p-2 inline-flex items-center justify-center transition duration-200 w-full"
        >
          {isOpen ? (
            <IoIosArrowDown className="text-white" size={28} />
          ) : (
            <IoIosArrowUp className="text-white" size={28} />
          )}
        </button>

        {isOpen && (
          <>
            <button
              onClick={openFilamentForm}
              data-tooltip-id="add-button-tooltip"
              data-tooltip-content="Add Item"
              className="bg-green-500 text-white hover:bg-green-600 rounded-full p-2 inline-flex items-center justify-center transition duration-200"
            >
              <IoIosAdd size={28} />
            </button>
            <Tooltip id="add-button-tooltip" place="right" effect="solid" />
            <button
              data-tooltip-id="archive-tooltip"
              data-tooltip-content={
                showArchived ? "Hide Archived" : "Show Archived"
              }
              onClick={toggleArchived}
              className={`${
                showArchived ? "bg-red-900" : "bg-red-600"
              } hover:bg-orange-800 rounded-full p-2 inline-flex items-center justify-center transition duration-200 w-full`}
            >
              <IoIosArchive className="text-white" size={28} />
            </button>
            <button
              data-tooltip-id="settings-tooltip"
              data-tooltip-content="Settings"
              className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 inline-flex items-center justify-center transition duration-200 w-full"
            >
              <IoIosSettings className="text-white" size={28} />
            </button>

            {/* Tooltip components */}
            <Tooltip id="archive-tooltip" place="right" effect="solid" />
            <Tooltip id="settings-tooltip" place="right" effect="solid" />
          </>
        )}
        {showFilamentForm && (
          <FilamentForm isOpen={openFilamentForm} onClose={closeFilamentForm} filamentId={null} />
        )}
      </div>
    </div>
  );
};

export default InventoryView;
