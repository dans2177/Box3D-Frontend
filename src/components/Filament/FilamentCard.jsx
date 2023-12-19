import { useState } from "react";
import { Link } from "react-router-dom"; 
import PropTypes from "prop-types";
import SubtractionForm from "./SubtractionForm";

const FilamentCard = ({ filament }) => {
  const [isSubtractionFormOpen, setIsSubtractionFormOpen] = useState(false);

  FilamentCard.propTypes = {
    filament: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
      type: PropTypes.string,
      temperature: PropTypes.string,
      currentAmount: PropTypes.number,
      startingAmount: PropTypes.number,
    }).isRequired,
  };

  const hasSubtractions = filament.currentAmount < filament.startingAmount;
  const remainingPercentage = hasSubtractions
    ? (filament.currentAmount / filament.startingAmount) * 100
    : 100;

  const openSubtractionForm = () => {
    setIsSubtractionFormOpen(true);
  };

  const closeSubtractionForm = () => {
    setIsSubtractionFormOpen(false);
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-4 shadow-md relative">
      <h3 className="text-lg font-semibold">{filament.name}</h3>
      <div
        className="absolute top-4 right-4 w-12 h-12"
        style={{ backgroundColor: filament.color }}
      ></div>
      <p>Type: {filament.type}</p>
      <p>Temperature: {filament.temperature}</p>
      <p>
        Length: {filament.currentAmount} (of {filament.startingAmount})
      </p>
      {hasSubtractions ? (
        <div className="relative">
          <div className="overflow-hidden h-6 text-xs flex rounded bg-red-200">
            <div
              style={{ width: `${100 - remainingPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
            ></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <span className="text-sm font-semibold">
              {remainingPercentage.toFixed(0)}% remaining
            </span>
          </div>
        </div>
      ) : (
        <p>No subtractions made yet.</p>
      )}
      <button
        onClick={openSubtractionForm}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
      >
        Subtract
      </button>
      {/* Change Delete button to View button */}
      <Link
        to={`/filament/${filament._id}`}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
      >
        View
      </Link>
      <SubtractionForm
        isOpen={isSubtractionFormOpen}
        onClose={closeSubtractionForm}
        filamentId={filament._id}
      />
    </div>
  );
};

export default FilamentCard;
