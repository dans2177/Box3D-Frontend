import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createSubtraction } from "../../slices/filamentSlice";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useParams } from "react-router-dom";

const SubtractionForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [subtractionAmount, setSubtractionAmount] = useState("");
  const { getToken } = useKindeAuth();
  const [token, setToken] = useState(null);
  const { filamentId } = useParams(); // Extract filamentId from the URL using useParams

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const fetchedToken = await getToken();
        setToken(fetchedToken);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, [getToken]);

  const handleSubtraction = async () => {
  ``
    const subtractionData = {
      filamentId: filamentId, // Use the extracted filamentId
      subtractionLength: Number(subtractionAmount),
      project: null,
    };
    console.log(subtractionData);

    dispatch(
      createSubtraction({
        filamentId: filamentId, // Use the extracted filamentId
        subtractionData,
        token: token,
      })
    );
    console.log("Subtraction created");
    setSubtractionAmount("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <h3 className="text-lg font-semibold">Subtract Filament</h3>
      <input
        type="number"
        value={subtractionAmount}
        onChange={(e) => setSubtractionAmount(e.target.value)}
        placeholder="Enter subtraction amount"
        className="border border-gray-300 rounded-md px-2 py-1 mt-2 w-full"
      />
      <button
        onClick={handleSubtraction}
        className="bg-blue-500 hover-bg-blue-600 text-white rounded-md px-4 py-2 mt-2"
      >
        Confirm
      </button>
    </Modal>
  );
};

SubtractionForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SubtractionForm;
