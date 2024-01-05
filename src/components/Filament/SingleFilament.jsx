// ----------------------------------------------------------------
// Imports
import { useState, useEffect } from "react";
import { ChromePicker } from "react-color";
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
  const [isArchived, setIsArchived] = useState(localFilament.isArchived);
  const [noteEdited, setNoteEdited] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(localFilament.name || "");
  const [editedTemp, setEditedTemp] = useState(localFilament.temperature || 0);
  const [editedLink, setEditedLink] = useState(localFilament.link || "");
  const [editedColor, setEditedColor] = useState(localFilament.color || "");
  const [urlError, setUrlError] = useState(""); // New state for URL error

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
  const handleColorChange = (color) => {
    setEditedColor(color.hex);
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "temperature") {
      setEditedTemp(value);
    } else if (name === "notes") {
      setEditedNote(value);
      setNoteEdited(true);
    } else if (name === "link") {
      setEditedLink(value);
      setUrlError("");
    } else if (name === "name") {
      if (value.length <= 5) {
        setEditedName(value);
      }
      // Optionally, you can add an else block to notify the user that the max length has been reached
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
    if (urlError) {
      toast.error("Please fix the errors before saving.");
      return;
    }
    try {
      const updateData = {
        ...localFilament, // Spread localFilament first
        _id: filamentId,
        name: editedName,
        temperature: editedTemp,
        link: editedLink,
        notes: editedNote,
        isArchived: isArchived,
        color: editedColor || localFilament.color,
      };

      console.log("Updating filament with data:", updateData); // Debugging log
      console.log("Saving with temperature:", editedTemp); // Debug log

      const token = await getToken();
      const updateResult = await dispatch(
        updateFilament({ filamentData: updateData, token })
      );
      console.log("Update result:", updateResult); // Debugging log

      if (updateResult.error) {
        throw new Error("Error in dispatching updateFilament");
      }

      setLocalFilament(updateData);
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
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            {/* Filament Image, Info, and CountUp */}
            <div className="flex items-center justify-between w-full">
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
                <h2 className="text-4xl pb-4 font-bold text-gray-200">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name" // Important: This should match the handleInputChange logic
                      value={editedName}
                      onChange={handleInputChange}
                      className="text-white bg-gray-800 border-gray-600 border-2 p-2 h-10 w-40 rounded"
                    />
                  ) : (
                    localFilament.name
                  )}
                </h2>
                <p className="text-gray-300">
                  {localFilament.material} {localFilament.size}mm
                </p>
                <p className="text-gray-300">
                  {isEditing ? (
                    <input
                      type="number"
                      name="temp"
                      value={editedTemp}
                      onChange={(e) => setEditedTemp(e.target.value)}
                      className="text-white bg-gray-800 border-gray-600 border-2 p-2  h-6 w-20 rounded"
                    />
                  ) : (
                    <p>{editedTemp}°</p>
                  )}
                </p>

                <div className="text-gray-300 ">
                  {isEditing ? (
                    <div>
                      <label>Link:</label>
                      <input
                        type="text"
                        name="link"
                        value={editedLink}
                        onChange={handleInputChange}
                        className={`text-white bg-gray-800 border ${
                          urlError ? "border-red-500" : "border-gray-600"
                        } p-2 m-2 h-6 w-48 rounded`}
                      />
                      {urlError && (
                        <p className="text-red-500 text-xs italic">
                          {urlError}
                        </p>
                      )}
                    </div>
                  ) : localFilament.link ? (
                    <a
                      href={
                        editedLink.startsWith("http://") ||
                        editedLink.startsWith("https://")
                          ? editedLink
                          : `http://${editedLink}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 flex items-center w-fit"
                    >
                      <FaExternalLinkAlt className="inline mr-1" />
                      Open Link
                    </a>
                  ) : (
                    <span className="text-gray-500">No Link Provided</span>
                  )}
                </div>
              </div>
              <div>
                {/* CountUp for Current Amount */}
                <CountUp
                  start={0}
                  end={Number(localFilament.currentAmount)} // Convert to a number
                  duration={2} // Set the duration for the CountUp animation (in seconds)
                  separator=","
                  className="text-5xl md:text-8xl text-gray-200 font-extrabold ml-4"
                  style={{
                    fontFamily: "'Orbitron', sans-serif", // Use the Orbitron font
                    letterSpacing: "2px", // Adjust letter spacing for a digital look
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Add a subtle shadow
                  }}
                />
                <span className="mr-0 md:mr-4 text-2xl text-gray-500 ml-1">
                  g
                </span>
              </div>
            </div>
            <div className="w-full gap-4 md:gap-0 md:w-auto md:ml-4 flex flex-row md:flex-col justify-between md:items-start">
              <button
                onClick={toggleEdit}
                className="flex items-center justify-center text-white py-2 px-4 rounded h-12 my-4 md:mb-0 flex-grow md:flex-grow-0 md:min-w-[140px] bg-blue-600 hover:bg-blue-700"
              >
                <FiEdit className="mr-2 text-base" />{" "}
                {/* Adjust text-base if needed */}
                {isEditing ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={handleArchive}
                className={`flex items-center justify-center text-white py-2 px-4 h-12 rounded my-4 md:mb-2 flex-grow md:flex-grow-0 md:min-w-[140px] ${
                  isArchived
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                <MdArchive className="mr-2 text-base" />{" "}
                {/* Adjust text-base if needed */}
                {isArchived ? "Unarchive" : "Archive"}
              </button>
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
              {isEditing && (
                <div className="p-4  ">
                  <label className="block text-lg font-medium text-white mb-2">
                    Update Color
                  </label>
                  <ChromePicker
                    color={editedColor}
                    onChangeComplete={handleColorChange}
                  />
                </div>
              )}

              {/* Conditionally rendered Save Button */}
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="text-white py-2 px-4 rounded mt-2 md:mt-2 flex-grow md:flex-grow-0 md:min-w-[140px] bg-orange-600 hover:bg-orange-700"
                >
                  Save Changes
                </button>
              )}
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
