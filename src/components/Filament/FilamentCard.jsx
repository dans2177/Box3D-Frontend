import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { GrView } from "react-icons/gr";
import Overlay from "../../assets/Overlay.png";
import SubtractionFilament from "./SubtractFilament.jsx";

const FilamentCard = ({ filament }) => {
  const titleRef = useRef(null);

  useEffect(() => {
    adjustTitleFontSize();
  }, [filament.name]);

  const adjustTitleFontSize = () => {
    const titleElement = titleRef.current;
    if (!titleElement) return;

    let fontSize = 32; // Initial font size in pixels
    const maxWidth = titleElement.parentElement.offsetWidth; // Maximum width available

    titleElement.style.fontSize = ""; // Reset font size

    while (titleElement.scrollWidth > maxWidth && fontSize > 12) {
      fontSize -= 1;
      titleElement.style.fontSize = `${fontSize}px`;
    }
  };

  const hasSubtractions = filament.currentAmount < filament.startingAmount;
  const remainingPercentage = hasSubtractions
    ? (filament.currentAmount / filament.startingAmount) * 100
    : 100;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-2 mb-4 grid gap-1 hover:shadow-lg overflow-hidden">
      <div className="flex flex-wrap justify-between items-center m-2 md:m-4">
        <div
          className="relative w-24 h-24 md:w-28 md:h-28 rounded-full ml-2 animate-spin hover:animate-spin-fast"
          style={{ backgroundColor: filament.color }}
        >
          <img
            src={Overlay}
            className="absolute inset-0 w-full h-full"
            alt="Filament Overlay"
          />
        </div>
        <div className="text-right flex-1 min-w-0">
          <h3
            className="text-gray-200 text-lg md:text-xl lg:text-2xl font-semibold truncate"
            ref={titleRef}
          >
            {filament.name}
          </h3>
          <p className="text-sm text-gray-300">
            Temp: {filament.temperature}°C
          </p>
        </div>
      </div>
      <div className="text-center text-purple-200 text-2xl md:text-3xl lg:text-4xl font-bold flex items-center justify-center pt-2 pb-6">
        {filament.currentAmount}g
      </div>
      <div className="flex justify-between text-sm mt-1 mb-2">
        <SubtractionFilament
          filamentId={filament._id}
          filamentName={filament.name}
          currentAmount={filament.currentAmount}
        />
        <Link
          to={`/filament/${filament._id}`}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded w-1/2 ml-1 flex items-center justify-center "
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
