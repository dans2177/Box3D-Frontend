import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-modal";
import { SketchPicker } from "react-color";
import { addFilament } from "../../slices/filamentSlice"; // Assuming you have a slice for filaments
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const FilamentForm = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { getToken } = useKindeAuth();
  const [filamentData, setFilamentData] = useState({
    name: "",
    type: "",
    temperature: 0,
    length: 0,
    color: "",
  });

  const toggleModal = () => {
    setIsOpen(!modalIsOpen);
  };

  const handleChange = (event) => {
    setFilamentData({
      ...filamentData,
      [event.target.name]: event.target.value,
    });
  };

  const handleColorChange = (color) => {
    setFilamentData({
      ...filamentData,
      color: color.hex,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = await getToken();

    // Set length and startingAmount to the same value
    const sameAmount = filamentData.length;

    // Update the filamentData object
    const updatedFilamentData = {
      ...filamentData,
      startingAmount: sameAmount,
    };

    // Dispatch the addFilament action with the updated filamentData
    dispatch(addFilament({ filamentData: updatedFilamentData, token }));

    // Reset the form fields
    setFilamentData({
      name: "",
      type: "",
      temperature: 0,
      length: 0,
      color: "",
      startingAmount: sameAmount, // Set startingAmount to the same value
    });

    toggleModal();
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Add Filament
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        contentLabel="Add Filament"
      >
        <button
          onClick={toggleModal}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
        <form onSubmit={handleSubmit} className="flex flex-col pt-4">
          <input
            type="text"
            name="name"
            value={filamentData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="mb-4 p-2 text-lg border rounded"
          />
          <input
            type="text"
            name="type"
            value={filamentData.type}
            onChange={handleChange}
            placeholder="Type"
            required
            className="mb-4 p-2 text-lg border rounded"
          />
          <input
            type="number"
            name="temperature"
            value={filamentData.temperature}
            onChange={handleChange}
            placeholder="Temperature"
            required
            className="mb-4 p-2 text-lg border rounded"
          />
          <input
            type="number"
            name="length"
            value={filamentData.length}
            onChange={handleChange}
            placeholder="Length"
            required
            className="mb-4 p-2 text-lg border rounded"
          />
          <SketchPicker
            color={filamentData.color}
            onChangeComplete={handleColorChange}
          />
          <button
            type="submit"
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default FilamentForm;
