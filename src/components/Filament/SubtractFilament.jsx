// SubtractionForm.js
import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import ReactModal from "react-modal";
import { createSubtraction } from "../../slices/filamentSlice"; // Adjust the import path as needed
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { GrSubtractCircle } from "react-icons/gr";
import { toast } from "react-toastify";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";

ReactModal.setAppElement("#root");

const SubtractionFilament = ({ filamentId, filamentName, currentAmount, className }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [subtractionAmount, setSubtractionAmount] = useState("");
  const dispatch = useDispatch();
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const { getToken } = useKindeAuth();

  const handleSubtraction = async () => {
    // Check if subtractionAmount is positive
    if (subtractionAmount > 0) {
      // Check if subtractionAmount is less than or equal to currentAmount
      if (subtractionAmount <= currentAmount) {
        try {
          const token = await getToken(); // Adjust Kinde authentication as needed
          await dispatch(
            createSubtraction({
              filamentId,
              subtractionAmount,
              token,
            })
          );
          setSubtractionAmount(""); // Clear input field after successful subtraction
          closeModal();
          toast.success("Subtraction successful!");
        } catch (error) {
          console.error("Error performing subtraction:", error);
          // Handle the error appropriately, e.g., show an error message
          toast.error("An error occurred while performing the subtraction");
        }
      } else {
        // Show Toastify error if subtractionAmount is not less than or equal to currentAmount
        toast.error(
          "Subtraction amount must be less than or equal to current amount"
        );
      }
    } else {
      // Show Toastify error if subtractionAmount is not positive
      toast.error("Subtraction amount needs to be positive");
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className={`${className}`}
      >
        <GrSubtractCircle className="text-2xl mr-1" />
        <span className="text-xs">Quick Subtract</span>
      </button>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Subtract Filament"
        className="Modal inline-block  overflow-hidden text-left align-middle transition-all transform bg-gray-200 dark:bg-gray-800  rounded-lg shadow-2"
        overlayClassName="Overlay fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      >
        <div className="p-6 max-w-sm mx-auto   rounded-lg ">
          <h2 className="text-lg font-bold mb-4 dark:text-gray-200 font-sans">
            Quick Subtract
          </h2>
          <h4 className="text-sm font-semibold mb-4 dark:text-gray-400 font-mono">
            from {filamentName}
          </h4>
          <input
            type="number"
            value={subtractionAmount}
            onChange={(e) => setSubtractionAmount(e.target.value)}
            placeholder="Amount to subtract"
            className="border dark:border-gray-300 p-2 rounded w-full mb-4"
          />
          <div className="flex justify-between space-x-4">
            <button
              onClick={handleSubtraction}
              className="border-4 border-green-700 dark:border-none dark:bg-green-500 dark:hover:bg-green-700 text-green-700 hover:bg-green-700 hover:text-white dark:text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-200 w-1/2"
            >
              <IoMdCheckmarkCircle className="mr-2" /> Confirm
            </button>
            <button
              onClick={closeModal}
              className="border-4 border-red-700 dark:border-none text-red-700  dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-700 dark:text-white hover:text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-200 w-1/2"
            >
              <IoMdCloseCircle className="mr-2" /> Close
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

SubtractionFilament.propTypes = {
  filamentId: PropTypes.string.isRequired,
  filamentName: PropTypes.string.isRequired,
  currentAmount: PropTypes.number.isRequired,
  className: PropTypes.string, 
};

export default SubtractionFilament;
