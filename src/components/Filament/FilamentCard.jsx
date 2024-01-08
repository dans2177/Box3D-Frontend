import { useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { GrView } from "react-icons/gr";
import Overlay from "../../assets/Overlay.png";
import SubtractionFilament from "./SubtractFilament.jsx";
import CountUp from "react-countup";

const FilamentCard = ({ filament }) => {
  const titleRef = useRef(null);
  const hasSubtractions = filament.currentAmount < filament.startingAmount;
  const remainingPercentage = hasSubtractions
    ? (filament.currentAmount / filament.startingAmount) * 100
    : 100;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-2 mb-4 grid gap-1 hover:shadow-lg overflow-hidden">
      <div className="flex flex-wrap justify-between items-center m-2 md:m-4">
        <div className="text-left flex-1 min-w-0">
          <h3
            className="text-gray-800 dark:text-gray-200 pb-2 text-4xl font-semibold truncate"
            ref={titleRef}
            style={{ fontFamily: "Montserrat, sans-serif" }} // Keeps the modern, clean font for the title
          >
            {filament.name}
          </h3>
          <p
            className="text-md text-red-600 dark:text-red-300"
            style={{ fontFamily: "Roboto, sans-serif" }} // Keeps the readable, simple font for the temperature
          >
            {filament.temperature}°C
          </p>
        </div>
        <div
          className="relative w-24 h-24 md:w-28 md:h-28 rounded-full mr-2 animate-spin hover:animate-spin-fast"
          style={{ backgroundColor: filament.color }}
        >
          <img
            src={Overlay}
            className="absolute inset-0 w-full h-full"
            alt="Filament Overlay"
          />
        </div>
      </div>

      <div className="text-center  text-2xl md:text-3xl lg:text-4xl font-bold flex items-center justify-center pt-2 pb-6">
        <CountUp
          start={0}
          end={filament.currentAmount}
          duration={1}
          separator=","
          className="text-4xl text-gray-800 dark:text-gray-200 font-extrabold font-orbitron"
        ></CountUp>
        <span className="text-lg text-gray-800 dark:text-gray-500 self-end mb-1 ml-1">
          g
        </span>
      </div>

      <div className="max-w-full bg-red-200 rounded-full h-4 overflow-hidden">
        {hasSubtractions ? (
          <div
            style={{ width: `${remainingPercentage}%` }}
            className="bg-green-500 h-full rounded-full overflow-hidden"
          ></div>
        ) : (
          <div className="bg-green-500 h-full rounded-full text-center text-xs text-white">
            No subtractions made yet.
          </div>
        )}
      </div>
      <div className="flex justify-between text-sm mx-4 my-4">
        <SubtractionFilament
          filamentId={filament._id}
          filamentName={filament.name}
          currentAmount={filament.currentAmount}
          className={` text-red-800 border-2 border-red-700 dark:border-none hover:bg-red-800 hover:text-white dark:bg-red-500 dark:hover:bg-red-700 dark:text-white font-bold py-1 px-3 rounded w-1/2 flex items-center justify-center ml-4`}
        />
        <Link
          to={`/filament/${filament._id}`}
          className="text-purple-800 border-2 border-purple-700 dark:border-none hover:bg-purple-800 hover:text-white dark:bg-purple-500 dark:hover:bg-purple-700 dark:text-white font-bold py-1 px-3 rounded w-1/2 flex items-center justify-center ml-4"
        >
          <GrView className="text-2xl mr-1" />
          <span className="text-xs">View</span>
        </Link>
      </div>
    </div>
  );
};

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

export default FilamentCard;
