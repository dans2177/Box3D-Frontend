// ----------------------------------------------------------------
// Imports
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateFilament,
  deleteSubtraction,
  deleteFilament,
} from "../../slices/filamentSlice";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { toast } from "react-toastify";
import { FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";
import { MdArchive } from "react-icons/md";
import { FiEdit, FiTrash } from "react-icons/fi";
import LoadingComponent from "../Others/Loading";
import SubtractionFilament from "./SubtractFilament";
import Overlay from "../../assets/Overlay.png";
import CountUp from "react-countup";

// ----------------------------------------------------------------
// Logic
const SingleFilament = () => {
  const { filamentId } = useParams();
  const dispatch = useDispatch();
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.filament.status === "loading");
  const reduxFilament = useSelector((state) =>
    state.filament.items.find((item) => item._id === filamentId)
  );

  // Local state to mirror filament data from Redux
  const [localFilament, setLocalFilament] = useState(reduxFilament || {});

  useEffect(() => {
    setLocalFilament(reduxFilament || {});
  }, [reduxFilament]);

  const [editedNote, setEditedNote] = useState(localFilament.notes || "");
  const [isArchived, setIsArchived] = useState(
    localFilament.isArchived || false
  );
  const [noteEdited, setNoteEdited] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(localFilament.name || "");
  const [editedTemp, setEditedTemp] = useState(localFilament.temperature || 0);
  const [editedLink, setEditedLink] = useState(localFilament.link || "");
  const [editedColor, setEditedColor] = useState(localFilament.color || "");

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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this filament?"
    );

    if (confirmDelete) {
      try {
        const token = await getToken();
        await dispatch(deleteFilament({ filamentId, token }));
        toast.success("Filament deleted successfully!");
        navigate(-1);
      } catch (error) {
        toast.error("Error deleting filament.");
        console.error("Error deleting filament:", error);
      }
    }
  };

  const remainingPercentage = localFilament
    ? (localFilament.currentAmount / localFilament.startingAmount) * 100
    : 0;

  const handleArchive = async () => {
    try {
      const token = await getToken();
      const updateData = {
        ...localFilament,
        isArchived: !isArchived,
      };

      await dispatch(updateFilament({ filamentData: updateData, token }));
      setIsArchived(!isArchived);
      toast.success(
        !isArchived
          ? "Filament archived successfully!"
          : "Filament unarchived successfully!"
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

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditedName(localFilament.name);
      setEditedTemp(localFilament.temperature);
      setEditedLink(localFilament.link || "");
    }
  };

  const handleSave = async () => {
    try {
      const updatedColor = editedColor || localFilament.color; // Use editedColor if it's defined, otherwise, use the current color

      const updateData = {
        _id: filamentId,
        name: editedName,
        temperature: editedTemp,
        link: editedLink,
        notes: editedNote,
        isArchived: isArchived,
        color: updatedColor,
        ...localFilament,
      };

      const token = await getToken();
      await dispatch(updateFilament({ filamentData: updateData, token }));
      setLocalFilament(updateData); // Update the local state
      toast.success("Filament updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Error updating filament.");
      console.error("Error updating filament:", error);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // ----------------------------------------------------------------
  // Views
  if (!localFilament) {
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

          {/* Filament Details */}
          <div className="flex items-center mb-4">
            {/* Filament Image */}
            <div
              className="relative w-32 h-32 md:w-38 md:h-38 rounded-full ml-2 animate-spin hover:animate-spin-fast"
              style={{ backgroundColor: localFilament.color }}
            >
              <img
                src={Overlay}
                className="absolute inset-0 w-full h-full"
                alt="Filament Overlay"
              />
            </div>
            {/* Filament Info */}
            <div className="ml-4 flex-grow">
              <h2 className="text-2xl font-bold text-gray-200">
                {isEditing ? (
                  <div>
                    <label>Link:</label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-white bg-gray-800 border-gray-600 border-2 p-2 m-2 h-10 w-28 rounded"
                    />
                  </div>
                ) : (
                  localFilament.name
                )}
              </h2>
              <p className="text-gray-300">
                Temp:
                {isEditing ? (
                  <input
                    type="number"
                    value={editedTemp}
                    onChange={(e) => setEditedTemp(e.target.value)}
                    className="text-white bg-gray-800 border-gray-600 border-2 p-2 m-2 h-6 w-20 rounded"
                  />
                ) : (
                  editedTemp
                )}
              </p>
              <div className="text-gray-300">
                {isEditing ? (
                  <div>
                    <label>Link:</label>
                    <input
                      type="text"
                      value={editedLink}
                      onChange={(e) => setEditedLink(e.target.value)}
                      className="text-white bg-gray-800 border-gray-600 border-2 p-2 m-2 h-6 w-48 rounded"
                    />
                  </div>
                ) : (
                  <a
                    href={localFilament.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500"
                  >
                    <FaExternalLinkAlt className="inline mr-1" />
                    {localFilament.link ? "Link Available" : "No Link Provided"}
                  </a>
                )}
              </div>
            </div>
            {/* CountUp for Current Amount */}
            <CountUp
              start={0}
              end={localFilament.currentAmount}
              duration={2}
              separator=","
              className="text-4xl text-gray-200 font-extrabold ml-4"
            />
            {/* Edit and Archive Buttons */}
            <div className="ml-4 flex flex-col items-start">
              <button
                onClick={toggleEdit}
                className="text-white py-2 px-4 rounded mb-2 flex items-center justify-center min-w-[140px] max-w-[140px] truncate overflow-hidden bg-blue-600 hover:bg-blue-700"
              >
                <FiEdit className="mr-2" />
                {isEditing ? "Cancel" : "Edit"}
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
              {/* Save Button */}
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="text-white py-2 px-4 rounded mt-2 flex items-center justify-center min-w-[140px] max-w-[140px] truncate overflow-hidden bg-orange-600 hover:bg-orange-700"
                >
                  Save
                </button>
              )}
            </div>
          </div>

          {/* Remaining Percentage Bar */}
          <div className="bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              style={{ width: `${remainingPercentage}%` }}
              className="bg-green-500 h-full rounded-full"
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
              {/* Update Notes Button */}
              {noteEdited && (
                <button
                  onClick={handleSave}
                  className={` text-white py-2 px-4 rounded mt-2 mr-2 ${
                    noteEdited
                      ? "bg-purple-700 hover:bg-purple-800"
                      : "bg-gray-600 "
                  }`}
                >
                  Update Notes
                </button>
              )}
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
                  filamentId={filamentId}
                  filamentName={localFilament.name}
                  currentAmount={localFilament.currentAmount}
                />
              </div>
              {localFilament.subtractions &&
                localFilament.subtractions.map(
                  (
                    subtraction // Used localFilament
                  ) => (
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
                  )
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------
// Export / Prop Validation
export default SingleFilament;
