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
import { GrSubtractCircle } from "react-icons/gr";
import { MdAutorenew } from "react-icons/md";
import { FiAlertTriangle, FiXCircle, FiSave } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

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
      }
    }
  };

  const remainingPercentage = localFilament
    ? (localFilament.currentAmount / localFilament.startingAmount) * 100
    : 0;

  const handleArchive = async (e) => {
    e.preventDefault();
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

  const handleSave = async (e) => {
    e.preventDefault();
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
      const token = await getToken();
      const updateResult = await dispatch(
        updateFilament({ filamentData: updateData, token })
      );

      if (updateResult.error) {
        throw new Error("Error in dispatching updateFilament");
      }

      setLocalFilament(updateData);
      toast.success("Filament updated successfully!");
      setIsEditing(false);
      setNoteEdited(false);
    } catch (error) {
      toast.error("Error updating filament.");
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
    <div className="bg-gray-300 dark:bg-gray-700 min-h-screen">
      <div className="bg-gray-200 p-4 mx-auto max-w-4xl dark:bg-gray-800 min-h-screen">
        <div className="mb-4">
          <div className="flex items-start mb-4">
            <div
              className="inline-flex justify-center items-center rounded-full transition-all p-1 hover:bg-green-900"
              onClick={handleBackClick}
              style={{ margin: "0 10px" }}
            >
              <FaArrowLeft
                size={24}
                className="text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Filament Details */}
          <div className="flex flex-col sm:flex-row justify-between items-start md:items-center mb-4">
            {/* Filament Image, Info, and CountUp */}
            <div className="flex justify-start items-start my-4">
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

              <div className="flex flex-col ml-4 ">
                <h2 className="text-4xl pb-4 font-bold text-gray-800 dark:text-gray-200 truncate">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedName}
                      onChange={handleInputChange}
                      className="dark:text-white dark:bg-gray-800 border-gray-600 border-2 p-2 h-10 w-40 rounded"
                    />
                  ) : (
                    localFilament.name
                  )}
                </h2>
                <p className="text-bold text-sm text-gray-900 dark:text-gray-300">
                  {localFilament.material} {localFilament.size}mm
                </p>
                <div className="text-sm text-red-700 dark:text-red-300">
                  {isEditing ? (
                    <input
                      type="number"
                      name="temp"
                      value={editedTemp}
                      onChange={(e) => setEditedTemp(e.target.value)}
                      className="dark:text-white dark:bg-gray-800 border-gray-600 border-2 p-2 h-6 w-20 rounded"
                    />
                  ) : (
                    <p>{editedTemp}°</p>
                  )}
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-300">
                  {isEditing ? (
                    <div>
                      <label>Link:</label>
                      <input
                        type="text"
                        name="link"
                        value={editedLink}
                        onChange={handleInputChange}
                        className={`dark:text-white dark:bg-gray-800 border ${
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
            </div>
            {/* CountUp Component */}
            <div className="mt-6 w-full flex justify-center items-center sm:w-auto">
              {isEditing ? (
                <div className="flex justify-center w-full sm:w-auto">
                  <ChromePicker
                    color={editedColor}
                    onChangeComplete={handleColorChange}
                  />
                </div>
              ) : (
                <div className="text-center sm:text-left font-orbitron">
                  <CountUp
                    start={0}
                    end={Number(localFilament.currentAmount)}
                    duration={2}
                    separator=","
                    className="text-auto text-8xl font-extrabold  tracking-wide text-gray-900 dark:text-gray-200"
                  />
                  <span className="text-lg text-gray-800 dark:text-gray-500 self-end mb-1 ml-1">
                    g
                  </span>
                </div>
              )}
            </div>

            <div className="w-full sm:w-auto mt-4 md:mr-4 sm:mt-0 flex flex-row sm:flex-col justify-between sm:items-start">
              {/* Edit Button */}
              {isEditing ? (
                <div className="flex mx-2 justify-between items-center  w-1/2 sm:w-full">
                  <button
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Cancel"
                    onClick={toggleEdit}
                    className="flex items-center justify-center border-4 w-1/2  dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-800 text-red-600 hover:text-white dark:text-white rounded h-12  sm:w-5/12 border-red-600 dark:border-none transition duration-150 ease-in-out mx-1"
                  >
                    <FiXCircle className="text-lg" />
                  </button>
                  <button
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Save"
                    onClick={handleSave}
                    className="flex items-center justify-center border-4 w-1/2 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-800 text-blue-600 hover:text-white dark:text-white rounded h-12 sm:w-5/12 border-blue-600 dark:border-none transition duration-150 ease-in-out mx-1"
                  >
                    <FiSave className="text-lg" />
                  </button>
                  <Tooltip id="tooltip" place="right" effect="solid" />
                </div>
              ) : (
                <button
                  onClick={toggleEdit}
                  className="flex items-center justify-center text-blue-600 hover:text-white mt-4 mx-2 dark:text-white py-2 px-4 rounded h-12 my-4 sm:mb-0 flex-grow md:flex-grow-0 sm:min-w-full dark:bg-blue-600 dark:hover:bg-blue-800 border-4 border-blue-600 dark:border-none hover:bg-blue-600 "
                >
                  <FiEdit className="mr-2 text-base" /> Edit
                </button>
              )}
              {/* Archive Button */}
              <button
                onClick={handleArchive}
                className={`flex items-center justify-center border-4 dark:border-none mt-4 mx-2 hover:text-white dark:text-white py-2 px-4 h-12 rounded my-4 sm:mb-2 flex-grow md:flex-grow-0 sm:w-full ${
                  isArchived
                    ? "dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-700 border-red-600 text-red-500"
                    : "dark:bg-green-500 hover:bg-green-600 dark:hover:bg-green-700 border-green-600 text-green-600"
                }`}
              >
                <MdArchive className="mr-2 text-base" />{" "}
                {/* Adjust text-base if needed */}
                {isArchived ? "Unarchive" : "Archive"}
              </button>
              {localFilament.name && localFilament.currentAmount > 0 && (
                <SubtractionFilament
                  filamentId={filamentId}
                  filamentName={localFilament.name}
                  currentAmount={localFilament.currentAmount}
                  className="flex items-center justify-center text-red-600 mt-4 sm:mt-2 hover:text-white dark:text-white w-1/4 sm:w-full md:w-f  mx-2 rounded h-12 sm:my-4 sm:mb-0 flex-grow md:flex-grow-0 md:min-w-[140px] dark:bg-red-600 dark:hover:bg-red-800 border-4 border-red-600 dark:border-none hover:bg-red-600"
                />
              )}
            </div>
          </div>

          {/* Remaining Percentage Bar */}
          <div className="bg-red-400 rounded-xl h-6 m-4 mt-8 border-2 border-gray-900">
            <div
              style={{ width: `${remainingPercentage}%` }}
              className="bg-green-500 h-full rounded-lg"
            ></div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="order-2 md:order-1 mb-10">
              <h3 className="text-xl font-bold mt-4 mb-2 text-gray-800 dark:text-gray-200">
                Notes
              </h3>
              <textarea
                name="notes"
                value={editedNote}
                onChange={handleInputChange}
                className="w-full h-32 p-2 border rounded mt-2  text-gray-900 dark:bg-slate-800 dark:text-gray-200"
              />
              {/* Update Notes Button */}
              {noteEdited && (
                <button
                  onClick={handleSave}
                  className={`flex items-center justify-center text-purple-600 border-4 border-purple-600 dark:border-none hover:text-white dark:text-white py-2 px-4 rounded mt-2 mr-2 ${
                    noteEdited
                      ? "dark:bg-purple-700 hover:bg-purple-600 dark:hover:bg-purple-900"
                      : "bg-gray-600"
                  }`}
                >
                  <MdAutorenew size={24} className="mr-2" /> Update Notes
                </button>
              )}
              <br />

              {/* Style the message and conditionally render the "Delete" button */}
              {isArchived && (
                <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-4 flex items-center justify-around">
                  <div className="flex items-center">
                    <FiAlertTriangle className="text-2xl mr-2" />
                    <p>
                      Do not delete!
                      <br />
                      Keep archived instead, else tracking data will be lost :(
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteFilament}
                    className="text-white py-2 px-4 rounded flex items-center justify-center min-w-[140px] max-w-[140px] bg-red-500 hover:bg-red-600"
                  >
                    <FiTrash className="mr-2" /> Delete
                  </button>
                </div>
              )}
            </div>

            <div className="order-1 md:order-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-4 mb-2">
                  Subtractions
                </h3>
              </div>
              {localFilament.subtractions &&
                localFilament.subtractions.map(
                  (
                    subtraction // Used localFilament
                  ) => (
                    <div
                      key={subtraction._id}
                      className="border-4 border-gray-500 dark:border-none mx-4 bg-gray-300 mb-2 p-auto pl-4 md:pl-6 text-xl md:text-2xl p-2 rounded flex items-center justify-between dark:text-gray-300 dark:bg-red-900"
                    >
                      <div className="flex-grow text-red-500 dark:text-gray-200 text-bold flex items-center tracking-widest font-orbitron">
                        <GrSubtractCircle className="mr-2" />
                        {subtraction.subtractionLength}g
                      </div>

                      <div className="flex items-center">
                        <div className="mr-4">
                          {new Date(subtraction.date).toLocaleDateString()}
                        </div>
                        <button
                          data-tooltip-id="tooltip"
                          data-tooltip-content="Delete"
                          onClick={() =>
                            handleDeleteSubtraction(subtraction._id)
                          }
                          className="border-4 rounded-full text-red-600 border-red-600 dark:border-none dark:bg-red-700 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white dark:text-white py-1 px-2"
                        >
                          <FiTrash />
                        </button>
                        <Tooltip id="tooltip" place="right" effect="solid" />
                      </div>
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
