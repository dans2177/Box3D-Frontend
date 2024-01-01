import { useState } from "react";
import { useDispatch } from "react-redux";
import { SliderPicker } from "react-color";
import { addFilament } from "../../slices/filamentSlice";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import Select from "react-select";
import PropTypes from "prop-types";

const FilamentForm = ({ isOpen, onClose }) => {
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

  const materialOptions = [
    { value: "PLA", label: "PLA - Polylactic Acid" },
    { value: "ABS", label: "ABS - Acrylonitrile Butadiene Styrene" },
    { value: "PETG", label: "PETG - Polyethylene Terephthalate Glycol" },
    { value: "TPU", label: "TPU - Thermoplastic Polyurethane" },
    { value: "Nylon", label: "Nylon" },
    { value: "PC", label: "PC - Polycarbonate" },
    { value: "PVA", label: "PVA - Polyvinyl Alcohol" },
    { value: "HIPS", label: "HIPS - High Impact Polystyrene" },
    { value: "Wood", label: "Wood-Filled" },
    { value: "Metal", label: "Metal-Filled" },
    { value: "Other", label: "Other" },
  ];
  const startingAmountOptions = [
    { value: "1000", label: "1000" },
    { value: "500", label: "500" },
  ];
  const sizeOptions = [
    { value: "1.75", label: "1.75 mm" },
    { value: "3", label: "3 mm" },
  ];

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "name" && value.length > 5) {
      return; // Prevent updating the state if the length exceeds 5
    }
    setFilamentData({ ...filamentData, [name]: value });
  };

  const handleColorChange = (color) => {
    setFilamentData({ ...filamentData, color: color.hex });
  };

  const handleSelectMaterialChange = (selectedOption) => {
    setFilamentData({ ...filamentData, material: selectedOption.value });
  };

  const handleSelectStartingAmountChange = (selectedOption) => {
    setFilamentData({ ...filamentData, startingAmount: selectedOption.value });
  };

  const handleSelectSizeChange = (selectedOption) => {
    setFilamentData({ ...filamentData, size: selectedOption.value });
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!filamentData.name) {
      setError("* Name is required.");
      return;
    }

    if (filamentData.link && !isValidUrl(filamentData.link)) {
      setError("Please enter a valid URL.");
      return;
    }

    const token = await getToken();

    try {
      const result = await dispatch(addFilament({ filamentData, token }));
      if (result.type.includes("fulfilled")) {
        toast.success("Filament added successfully");
        onClose();
      } else {
        toast.error("Error adding filament");
      }
    } catch (error) {
      console.error("Error adding filament:", error);
      toast.error("Error adding filament");
    }
  };

  return (
    <div className="">
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Add Filament"
        className="max-w-2xl mx-auto bg-gray-700 text-white rounded-lg p-6 border-gray-400 border-2 m-4 shadow-lg overflow-auto"
      >
        <div className="max-h-[80vh] ">
          {/* Adjust this max height as needed */}
          <div className="flex items-top justify-between pb-4">
            <h2 className="text-2xl pb-4 text-gray-200 font-semibold">
              Add Filament
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition duration-300 ease-in-out"
            >
              <FaTimes />
            </button>
          </div>

          <form className="space-y-4">
            {/* ID Field */}
            <div className="mb-4">
              <label className="block text-gray-200 text-sm font-bold mb-2">
                ID (Max 5 chars):
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="name"
                placeholder="Enter ID (Max 5)"
                value={filamentData.name}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            {/* Link Field */}
            <div className="mb-4">
              <label className="block text-gray-200 text-sm font-bold mb-2">
                Link:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="link"
                placeholder="Enter Link"
                value={filamentData.link}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            {/* Material Field */}
            <div className="mb-4">
              <label className="block text-gray-200 text-sm font-bold mb-2">
                Material:
              </label>
              <Select
                options={materialOptions}
                className="text-gray-700"
                onChange={handleSelectMaterialChange}
                value={materialOptions.find(
                  (option) => option.value === filamentData.material
                )}
              />
              {filamentData.material === "Other" && (
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-3"
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
              <label className="block text-gray-200 text-sm font-bold mb-2">
                Size:
              </label>
              <Select
                options={sizeOptions}
                className="text-gray-700"
                onChange={handleSelectSizeChange}
                value={sizeOptions.find(
                  (option) => option.value === filamentData.size
                )}
                isSearchable={false}
              />
            </div>

            {/* Temperature Field */}
            <div className="mb-4">
              <label className="block text-gray-200 text-sm font-bold mb-2">
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
              <label className="block text-gray-200 text-sm font-bold mb-2">
                Starting Amount:
              </label>
              <Select
                options={startingAmountOptions}
                className="text-gray-700"
                onChange={handleSelectStartingAmountChange}
                value={startingAmountOptions.find(
                  (option) => option.value === filamentData.startingAmount
                )}
                isSearchable={false}
              />
              {filamentData.startingAmount === "Other" && (
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-3"
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
              <label className="block text-gray-200 text-sm font-bold mb-2">
                Color:
              </label>
              <SliderPicker
                color={filamentData.color}
                onChangeComplete={handleColorChange}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-between ">
              {/* Error Message */}

              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mb-20 px-4 rounded"
              >
                Save Filament
              </button>
              {error && <p className="text-red-500 text-md italic">{error}</p>}
            </div>
          </form>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

FilamentForm.propTypes = {
  filamentId: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onUpdated: PropTypes.func,
};

export default FilamentForm;
