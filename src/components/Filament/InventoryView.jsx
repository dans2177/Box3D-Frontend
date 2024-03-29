import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { fetchFilaments } from "../../slices/filamentSlice";
import FilamentCard from "./FilamentCard";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  IoIosArchive,
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosArrowBack,
  IoIosAdd,
} from "react-icons/io";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../Others/Loading";
import { Tooltip } from "react-tooltip";
import FilamentForm from "./FilamentForm.jsx";
import { toast } from "react-toastify";

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

  // Get the filament items and filament state
  const filamentItems = useSelector(selectFilamentItems);
  const filamentState = useSelector((state) => state.filament);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        await dispatch(fetchFilaments(token));
      } catch (error) {
        toast.error("Error fetching");
      }
    };

    fetchData();
  }, [dispatch, getToken]);

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
    <div className="p-4 bg-gray-200 dark:bg-gray-700 min-h-screen relative pb-20">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="flex items-center">
          <div
            className="inline-flex justify-center items-center rounded-full transition-all p-1 hover:bg-green-900"
            onClick={handleBackClick}
            style={{ margin: "0 10px" }}
          >
            <IoIosArrowBack
              size={24}
              className="text-gray-900 dark:text-gray-200"
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800  dark:text-gray-100">
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
        className={`fixed bottom-0 left-0 m-4 bg-cyan-50  dark:bg-gray-800 rounded-lg p-2 flex flex-col items-center ${
          isOpen ? "space-y-2" : ""
        }`}
      >
        <button
          onClick={toggleCommandCenter}
          className="text-amber-500 border-4 border-amber-500 dark:bg-amber-600 hover:text-white dark:text-white dark:border-none hover:bg-amber-500 rounded-full p-2 inline-flex items-center justify-center transition duration-200 w-full"
        >
          {isOpen ? (
            <IoIosArrowDown size={28} />
          ) : (
            <IoIosArrowUp  size={28} />
          )}
        </button>
        {isOpen && (
          <>
            <button
              onClick={() => setShowFilamentForm(true)}
              data-tooltip-id="tooltip"
              data-tooltip-content="Add Item"
              className="border-4 border-green-600  dark:text-white dark:border-none text-green-600 hover:text-white dark:bg-green-500 darkLtext-white hover:bg-green-600 rounded-full p-2 inline-flex items-center justify-center transition duration-200"
            >
              <IoIosAdd size={28} />
            </button>
            <Tooltip id="add-button-tooltip" place="right" effect="solid" />
            <button
              data-tooltip-id="tooltip"
              data-tooltip-content={
                showArchived ? "Hide Archived" : "Show Archived"
              }
              onClick={toggleArchived}
              className={`${
                showArchived ? "dark:bg-red-900" : "dark:bg-red-600"
              } hover:bg-red-600 border-4 dark:border-none text-red-600 border-red-600 hover:text-white rounded-full p-2 inline-flex items-center justify-center transition duration-200 w-full`}
            >
              <IoIosArchive className=" dark:text-white" size={28} />
            </button>
          

            {/* Tooltip components */}
            <Tooltip id="tooltip" place="right" effect="solid" />
          </>
        )}
        {showFilamentForm && (
          <FilamentForm
            isOpen={showFilamentForm}
            onClose={() => setShowFilamentForm(false)} // Close the form
          />
        )}
      </div>
    </div>
  );
};

export default InventoryView;
