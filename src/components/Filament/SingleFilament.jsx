// ----------------------------------------------------------------
// Imports
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSingleFilament,
  updateFilament,
  deleteSubtraction,
  deleteFilament,
} from "../../slices/filamentSlice";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import LoadingComponent from "../Others/Loading";
import SubtractionFilament from "./SubtractFilament";
import Overlay from "../../assets/Overlay.png";
import { MdArchive } from "react-icons/md";
import { FiEdit, FiTrash } from "react-icons/fi";
import FilamentForm from "./FilamentForm";
import { FaExternalLinkAlt } from "react-icons/fa";
import CountUp from "react-countup";

// ----------------------------------------------------------------
// Logic
const SingleFilament = () => {
  const { filamentId } = useParams();
  const dispatch = useDispatch();
  const { getToken } = useKindeAuth();
  const loading = useSelector((state) => state.filament.status === "loading");
  const filament = useSelector((state) =>
    state.filament.items.find((item) => item._id === filamentId)
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedNote, setEditedNote] = useState("");
  const [isArchived, setIsArchived] = useState(false);
  const [noteEdited, setNoteEdited] = useState(false);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteSubtraction = async (subtractionId) => {
    try {
      const token = await getToken();
      await dispatch(deleteSubtraction({ filamentId, subtractionId, token }));
      toast.success("Subtraction deleted successfully!");
    } catch (error) {
      toast.error("Error deleting subtraction.");
      console.error("Error deleting subtraction:", error);
    }
  };

  const handleDeleteFilament = async () => {
    // Display a confirmation dialog before proceeding with deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this filament?"
    );

    if (confirmDelete) {
      try {
        const token = await getToken();
        await dispatch(deleteFilament({ filamentId, token }));
        toast.success("Filament deleted successfully!");
        navigate(-1); // Go back to the previous page or handle navigation as needed
      } catch (error) {
        toast.error("Error deleting filament.");
        console.error("Error deleting filament:", error);
      }
    }
  };

  const remainingPercentage = filament
    ? (filament.currentAmount / filament.startingAmount) * 100
    : 0;

  const handleArchive = async () => {
    try {
      const token = await getToken();
      const updateData = {
        ...filament,
        isArchived: !isArchived,
      };

      // Dispatch the updateFilament action to update the filament data
      await dispatch(updateFilament({ filamentData: updateData, token }));
      setIsArchived(!isArchived);
      toast.success(
        isArchived ? "Unarchived successfully!" : "Archived successfully!"
      );
    } catch (error) {
      toast.error("Error in archiving.");
      console.error("Error archiving:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "notes") {
      setEditedNote(value);
      setNoteEdited(true);
    }
  };

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const updatedFilament = await dispatch(
          getSingleFilament({ filamentId, token })
        );

        // Dispatch the updateFilament action to update the Redux state with the new data
        await dispatch(updateFilament(updatedFilament));
      } catch (error) {
        console.error("Error fetching updated filament data:", error);
        // Handle any errors here
      }
    };

    fetchData();
  }, [filamentId, getToken, dispatch]);

  const handleUpdate = async () => {
    if (!noteEdited) {
      return;
    }

    try {
      const token = await getToken();
      const updateData = {
        _id: filamentId,
        notes: editedNote,
        isArchived: isArchived,
      };

      // Dispatch the updateFilament action to update the filament data
      await dispatch(updateFilament({ filamentData: updateData, token }));

      toast.success("Update successful!");

      setNoteEdited(false);
      // You can access the updated filament data here in the `updatedFilament` variable
      // Example: console.log("Updated Filament Data:", updatedFilament);
    } catch (error) {
      toast.error("Error updating.");
      console.error("Error updating:", error);
    }
  };

  // ----------------------------------------------------------------
  // Views
  if (!filament) {
    return <div>Filament Not Found :( </div>;
  }

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="bg-gray-700 min-h-screen">
      <div className="p-4 mx-auto max-w-4xl bg-gray-800 min-h-screen">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleBackClick}
              className="text-green-200 text-lg"
            >
              <FaArrowLeft className="inline mr-2" />
            </button>
            <h1 className="text-2xl font-bold text-center"></h1>
            <div></div>
          </div>

          <div className="flex items-center mb-4">
            <div
              className="relative w-32 h-32 md:w-38 md:h-38 rounded-full ml-2 animate-spin hover:animate-spin-fast"
              style={{ backgroundColor: filament.color }}
            >
              <img
                src={Overlay}
                className="absolute inset-0 w-full h-full"
                alt="Filament Overlay"
              />
            </div>
            <div className="ml-4 flex-grow">
              <h2 className="text-2xl font-bold text-gray-200">
                {filament.name}
              </h2>
              <p className="text-gray-300">
                Temperature: {filament.temperature}
              </p>
              <div className="text-gray-300">
                {filament.link ? (
                  <a
                    href={filament.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex items-center text-blue-500">
                      <FaExternalLinkAlt />
                      <span className="m-1">Link Available</span>
                    </div>
                  </a>
                ) : (
                  `No Link Provided`
                )}
              </div>
            </div>
            {/* Add the CountUp component here to display current amount */}
            <CountUp
              start={0}
              end={filament.currentAmount} // Use the current amount as the end value
              duration={2} // Specify the animation duration
              separator="," // Use a comma as the separator
              className="text-4xl text-gray-200 font-extrabold ml-4" // Customize the styling
            />
            <div className="ml-4 flex flex-col items-start">
              <button
                onClick={openEditModal}
                className="text-white py-2 px-4 rounded mb-2 flex items-center justify-center min-w-[140px] max-w-[140px] truncate overflow-hidden bg-blue-600 hover:bg-blue-700"
              >
                <FiEdit className="mr-2" />
                Edit
              </button>
              <button
                onClick={handleArchive}
                className={`text-white py-2 px-4 rounded flex items-center justify-center min-w-[140px] max-w-[140px] truncate overflow-hidden ${
                  isArchived
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                <MdArchive className="mr-2" />
                {isArchived ? "Unarchive" : "Archive"}
              </button>
              {/* Step 2: Conditionally render the "Delete" button */}
            </div>
          </div>

          <div className="bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              style={{ width: `${remainingPercentage}%` }}
              className="bg-blue-600 h-2.5 rounded-full"
            ></div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="order-2 md:order-1">
              <h3 className="text-xl font-bold mt-4 mb-2 text-gray-200">
                Notes
              </h3>
              <textarea
                name="notes"
                value={editedNote}
                onChange={handleInputChange}
                className="w-full h-32 p-2 border rounded mt-2 bg-slate-800 text-gray-200"
              />
              <button
                onClick={handleUpdate}
                className={` text-white py-2 px-4 rounded mt-2 mr-2 ${
                  noteEdited
                    ? "bg-purple-700 hover:bg-purple-800"
                    : "bg-gray-600 "
                }`}
              >
                Update Notes
              </button>
              <br />
              {/* Conditionally render the "Delete" button */}
              {isArchived && (
                <button
                  onClick={handleDeleteFilament}
                  className="text-white py-2 mt-10 px-4 rounded flex items-center justify-center min-w-[140px] max-w-[140px] bg-red-500 hover:bg-red-600"
                >
                  <FiTrash className="mr-2" />{" "}
                  {/* Icon with margin-right for spacing */}
                  Delete
                </button>
              )}
              {/* Style the message */}
              {isArchived && (
                <p className="text-gray-300 mt-2">
                  Do not delete!
                  <br /> Keep archived instead, else tracking data will be lost
                  :(
                </p>
              )}
            </div>

            <div className="order-1 md:order-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-gray-200 mt-4 mb-2">
                  Subtractions
                </h3>
                <SubtractionFilament
                  filamentId={filament._id}
                  filamentName={filament.name}
                  currentAmount={filament.currentAmount}
                />
              </div>
              {filament.subtractions.map((subtraction) => (
                <div
                  key={subtraction._id}
                  className="mb-2 border p-2 rounded flex items-center justify-between text-gray-300 bg-red-900"
                >
                  <div>
                    <span className="font-semibold">Length:</span>
                    {subtraction.subtractionLength}g
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span>
                    {new Date(subtraction.date).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleDeleteSubtraction(subtraction._id)}
                    className="bg-red-600 hover:bg-red-800 text-white py-1 px-2 rounded"
                  >
                    <FiTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {isEditModalOpen && (
          <FilamentForm
            filamentId={filamentId}
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
          />
        )}
      </div>
    </div>
  );
};
// ----------------------------------------------------------------
// Export / Prop Validation
export default SingleFilament;
