import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleFilament, updateFilament } from "../../slices/filamentSlice";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCut } from "react-icons/fa"; // Import arrow icon for the back button
import LoadingComponent from "../Others/Loading";
import SubtractionFilament from "./SubtractFilament";
import Overlay from "../../assets/Overlay.png";
import { MdArchive } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

const SingleFilament = () => {
  const { filamentId } = useParams();
  const dispatch = useDispatch();
  const { getToken } = useKindeAuth();
  const loading = useSelector((state) => state.filament.status === "loading");

  // Get the filament data directly from the Redux store
  const filament = useSelector((state) => {
    return state.filament.items.find((item) => item._id === filamentId);
  });

  const remainingPercentage = filament
    ? (filament.currentAmount / filament.startingAmount) * 100
    : 0;
  const initialNote = filament?.notes || "";
  const [editedNote, setEditedNote] = useState(initialNote);
  const [isArchived, setIsArchived] = useState(filament?.isArchived || false);
  const [noteEdited, setNoteEdited] = useState(false);

  useEffect(() => {
    const fetchTokenAndFilament = async () => {
      try {
        const token = await getToken();
        dispatch(getSingleFilament({ filamentId, token }));
      } catch (error) {
        console.error("Error fetching token or filament data:", error);
      }
    };

    fetchTokenAndFilament();
  }, [dispatch, filamentId, getToken]);

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

  const handleUpdate = async () => {
    if (!noteEdited) {
      return;
    }

    const token = await getToken();
    const updateData = {
      _id: filamentId,
      notes: editedNote,
      isArchived: isArchived,
    };

    dispatch(updateFilament({ filamentData: updateData, token }))
      .unwrap()
      .then(() => {
        toast.success("Update successful!");
        setNoteEdited(false);
      })
      .catch((error) => {
        toast.error("Error updating.");
        console.error("Error updating:", error);
      });
  };

  if (!filament) {
    return <div>Filament Not Found :( </div>;
  }

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="bg-gray-700 min-h-screen">
      {" "}
      {/* Set the background color and ensure it covers minimum full height of the screen */}
      <div className="p-4 mx-auto max-w-4xl bg-gray-800 min-h-screen">
        {" "}
        {/* Centered container with padding */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleBackClick}
              className="text-green-200 text-lg"
            >
              <FaArrowLeft className="inline mr-2" />
            </button>
            <h1 className="text-2xl font-bold text-center"></h1>
            <div></div> {/* Placeholder for alignment */}
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
                Manufacturer: {filament.manufacturer}
              </p>
              <p className="text-gray-300">
                Temperature: {filament.temperature}
              </p>
            </div>
            <div className="ml-4 flex flex-col items-start">
              {/* Adjusted for alignment */}
              <button className="text-white py-2 px-4 rounded mb-2 flex items-center justify-center min-w-[140px] max-w-[140px] truncate overflow-hidden bg-blue-600 hover:bg-blue-700">
                <FiEdit className="mr-2" /> {/* Icon for Edit */}
                Edit
              </button>
              <button
                onClick={() => setIsArchived(!isArchived)}
                className={`text-white py-2 px-4 rounded flex items-center justify-center min-w-[140px] max-w-[140px] truncate overflow-hidden ${
                  isArchived
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                <MdArchive className="mr-2" /> {/* Icon for Archive */}
                {isArchived ? "Unarchive" : "Archive"}
              </button>
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
              {" "}
              {/* Notes Section */}
              <h3 className="text-xl font-bold mt-4 mb-2 text-gray-200">
                {" "}
                Notes{" "}
              </h3>
              <textarea
                name="notes"
                value={editedNote}
                onChange={handleInputChange}
                className="w-full h-32 p-2 border rounded mt-2 bg-slate-800 text-gray-200"
              />
              <button
                onClick={handleUpdate}
                className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded mt-2 mr-2"
              >
                Update Notes
              </button>
            </div>

            <div className="order-1 md:order-2">
              {" "}
              {/* Subtractions Section */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-gray-200 mt-4 mb-2">
                  Subtractions
                </h3>
                <SubtractionFilament filamentId={filament._id} filamentName={filament.name} />
              </div>
              {filament.subtractions.map((subtraction) => (
                <div
                  key={subtraction._id}
                  className="mb-2 border p-2 rounded flex items-center justify-between text-gray-300 bg-red-900"
                >
                  <div className="flex items-center">
                    <FaCut className="mr-2" />
                    <p>
                      <strong>Length:</strong> {subtraction.subtractionLength}
                    </p>
                  </div>
                  <p>
                    <strong>Date:</strong>{" "}
                    {subtraction.date
                      ? new Date(subtraction.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "Invalid Date"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleFilament;
