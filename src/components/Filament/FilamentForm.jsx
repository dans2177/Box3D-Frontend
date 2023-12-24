import { useState } from "react";
import { useDispatch } from "react-redux";
import { SliderPicker } from "react-color";
import { addFilament } from "../../slices/filamentSlice";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

const FilamentForm = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { getToken } = useKindeAuth();
  const [filamentData, setFilamentData] = useState({
    name: "",
    type: "",
    temperature: 215,
    length: 0,
    color: "#FFFFFF",
    link: "",
    material: "",
    startingAmount: "",
    notes: "",
    size: "",
    customLink: "",
    customMaterial: "",
    customStartingAmount: "",
  });

  const [error, setError] = useState("");

  const toggleModal = () => {
    setIsOpen(!modalIsOpen);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilamentData({
      ...filamentData,
      [name]: value,
    });
  };

  const handleColorChange = (color) => {
    setFilamentData({ ...filamentData, color: color.hex });
  };

  const handleLinkChange = (e) => {
    const value = e.target.value;
    setFilamentData({
      ...filamentData,
      Link: value,
      customLink: value === "Other" ? "" : filamentData.customLink,
    });
  };

  const handleMaterialChange = (e) => {
    const value = e.target.value;
    setFilamentData({
      ...filamentData,
      material: value,
      customMaterial: value === "Other" ? "" : filamentData.customMaterial,
    });
  };

  const handleStartingAmountChange = (e) => {
    const value = e.target.value;
    setFilamentData({
      ...filamentData,
      startingAmount: value,
      customStartingAmount:
        value === "Other" ? "" : filamentData.customStartingAmount,
    });
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    setFilamentData({ ...filamentData, size: value });
  };

  const handleSave = async () => {
    const token = await getToken();
    const updatedFilamentData = { ...filamentData };

    try {
      const result = await dispatch(
        addFilament({ filamentData: updatedFilamentData, token })
      );

      if (addFilament.fulfilled.match(result)) {
        toast.success("Filament added successfully 👌");
        setFilamentData({
          name: "",
          type: "",
          temperature: 0,
          length: 0,
          color: "#FFFFFF",
          Link: "",
          material: "",
          startingAmount: "",
          notes: "",
          size: "",
          customLink: "",
          customMaterial: "",
          customStartingAmount: "",
        });
        toggleModal();
      } else {
        toast.error("Error adding filament 🤯");
        setError("Error adding filament 🤯");
      }
    } catch (error) {
      console.error("Error adding filament:", error);
      toast.error("Error adding filament 🤯");
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={toggleModal}
        className="border border-green-500 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300 ease-in-out"
      >
        Add Filament
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        contentLabel="Add Filament"
        className="max-w-2xl mx-auto bg-white rounded-lg p-6 border-black border-2 m-4 shadow-lg"
      >
        <button
          onClick={toggleModal}
          className="mb-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Close
        </button>
        <form className="space-y-4">
          {/* ID Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              ID:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="name"
              placeholder="Enter ID"
              value={filamentData.name}
              onChange={handleChange}
            />
          </div>

          {/* Link Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Link:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="name"
              placeholder="Enter Link"
              value={filamentData.name}
              onChange={handleChange}
            />
          </div>

          {/* Material Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Material:
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              name="material"
              value={filamentData.material}
              onChange={handleMaterialChange}
            >
              <option value="">--Select Material--</option>
              {/* Add your material options here */}
              <option value="Other">Other</option>
            </select>
            {filamentData.material === "Other" && (
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="customMaterial"
                placeholder="Enter custom material"
                value={filamentData.customMaterial}
                onChange={handleChange}
              />
            )}
          </div>

          {/* Size Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Size:
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              name="size"
              value={filamentData.size}
              onChange={handleSizeChange}
            >
              <option value="">--Select Size--</option>
              <option value="1.75">1.75 mm</option>
              <option value="2.85">2.85 mm</option>
              <option value="3">3 mm</option>
            </select>
          </div>

          {/* Temperature Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Temp:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              name="temperature"
              placeholder="Enter Temp (Numbers Only)"
              value={filamentData.temperature}
              onChange={handleChange}
            />
          </div>

          {/* Starting Amount Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Starting Amount:
            </label>
            <select
              className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              name="startingAmount"
              value={filamentData.startingAmount}
              onChange={handleStartingAmountChange}
            >
              <option value="">--Select Starting Amount--</option>
              <option value="1000">1000</option>
              <option value="500">500</option>
              <option value="Other">Other</option>
            </select>
            {filamentData.startingAmount === "Other" && (
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="customStartingAmount"
                placeholder="Enter custom starting amount."
                value={filamentData.customStartingAmount}
                onChange={handleChange}
              />
            )}
          </div>

          {/* Color Picker Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Color:
            </label>
            <SliderPicker
              color={filamentData.color}
              onChangeComplete={handleColorChange}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Filament
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default FilamentForm;
