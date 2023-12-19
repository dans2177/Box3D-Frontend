import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleFilament, updateFilament } from "../../slices/filamentSlice";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCut } from "react-icons/fa"; // Import arrow icon for the back button
import SubtractionForm from "./SubtractionForm"; // Adjust the path as necessary
import LoadingComponent from "../Others/Loading";

const SingleFilament = () => {
  const { filamentId } = useParams();
  const dispatch = useDispatch();
  const { getToken } = useKindeAuth();
  const [isSubtractionFormOpen, setIsSubtractionFormOpen] = useState(false);

  const toggleSubtractionForm = () => {
    setIsSubtractionFormOpen(!isSubtractionFormOpen);
  };
  const loading = useSelector((state) => state.filament.status === "loading");

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "notes") {
      setEditedNote(value);
      setNoteEdited(true); // Set the flag to indicate note edit
    }
  };
  const navigate = useNavigate();

  const handleBackClick = () => {
    // Use navigate function for navigation
    navigate(-1); // Go back one step in history
  };

  const handleUpdate = async () => {
    if (!noteEdited) {
      // If the note hasn't been edited, do nothing
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
        setNoteEdited(false); // Reset the flag after a successful update
      })
      .catch((error) => {
        toast.error("Error updating.");
        console.error("Error updating:", error);
      });
  };

  if (!filament) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return <LoadingComponent />; // Or any other loading component
  }

  // Rest of your component code

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button onClick={handleBackClick} className="text-blue-500 text-lg m-4">
          <FaArrowLeft className="inline mr-2" />
          Back
        </button>
        <div
          className="w-40 h-40 rounded-full"
          style={{ backgroundColor: filament.color }}
        ></div>
        <div className="ml-4 flex-grow">
          <h2 className="text-2xl font-bold">{filament.name}</h2>
          <p>Manufacturer: {filament.manufacturer}</p>
          <p>Temperature: {filament.temperature}</p>
        </div>

        <button className="bg-blue-500 text-white py-2 px-4 rounded ml-2">
          Edit
        </button>
        <button
          onClick={() => setIsArchived(!isArchived)}
          className={`${
            isArchived ? "bg-gray-400" : "bg-blue-500"
          } text-white py-2 px-4 rounded ml-2`}
        >
          {isArchived ? "Unarchive" : "Archive"}
        </button>
      </div>

      <div className="bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          style={{ width: `${remainingPercentage}%` }}
          className="bg-blue-600 h-2.5 rounded-full"
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-bold mt-4 mb-2"> Notes</h3>
          <textarea
            name="notes"
            value={editedNote}
            onChange={handleInputChange}
            className="w-full h-32 p-2 border rounded mt-2"
          />
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white py-2 px-4 rounded mt-2 mr-2"
          >
            Update Note
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">Subtractions</h3>
            <button
              onClick={toggleSubtractionForm}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
            >
              {isSubtractionFormOpen ? "Close Form" : "Add Subtraction"}
            </button>
          </div>
          {filament.subtractions.map((subtraction) => (
            <div
              key={subtraction._id}
              className="mb-2 border p-2 rounded flex items-center justify-between"
            >
              <div className="flex items-center">
                <FaCut className="mr-2" />
                <p>
                  <strong>Subtraction:</strong> {subtraction.subtractionLength}
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
      <SubtractionForm
        isOpen={isSubtractionFormOpen}
        onClose={toggleSubtractionForm}
        filamentId={filamentId}
      />
    </div>
  );
};

export default SingleFilament;
