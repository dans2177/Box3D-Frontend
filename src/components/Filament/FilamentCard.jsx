import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { GrSubtractCircle, GrView } from "react-icons/gr";
import Overlay from "../../assets/Overlay.png";

const FilamentCard = ({ filament }) => {
  FilamentCard.propTypes = {
    filament: PropTypes.shape({
      _id: PropTypes.string,
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

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-2 mb-4 grid gap-1 hover:shadow-lg ">
      {/* Card hover effect */}
      <div className="flex justify-between items-center m-4">
        <div
          className="relative w-28 h-28 rounded-full ml-2 animate-spin hover:animate-spin-fast" // Use animate-spin-fast on hover, define this in Tailwind config
          style={{ backgroundColor: filament.color }}
        >
          <img
            src={Overlay}
            className="absolute inset-0 w-full h-full"
            alt="Filament Overlay"
          />
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-semibold">{filament.name}</h3>
          <p className="text-xs font-light">Temp: {filament.temperature}°C</p>
        </div>
      </div>
      <div className="text-center text-4xl font-bold flex items-center justify-center pt-2 pb-6">
        {filament.currentAmount}g
      </div>
      <div className="flex justify-between text-sm mt-1 mb-2">
        <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded w-1/2 mr-1 flex items-center justify-center hover:scale-105 transition duration-300" // Button hover effect
        >
          <GrSubtractCircle className="text-2xl mr-1" />
          <span className="text-xs">Subtract</span>
        </Link>
        <Link
          to={`/filament/${filament._id}`}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded w-1/2 ml-1 flex items-center justify-center hover:scale-105 transition duration-300" // Button hover effect
        >
          <GrView className="text-2xl mr-1" />
          <span className="text-xs">View</span>
        </Link>
      </div>
      <div className="w-full bg-red-200 rounded-full h-4 overflow-hidden">
        {hasSubtractions ? (
          <div
            style={{ width: `${remainingPercentage}%` }}
            className="bg-green-500 h-full rounded-full"
          ></div>
        ) : (
          <div className="bg-green-500 h-full rounded-full text-center text-xs text-white">
            No subtractions made yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default FilamentCard;
