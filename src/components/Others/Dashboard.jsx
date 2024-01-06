import DashboardLogo from "../../assets/DashboardLogo.gif";
import projectsImage from "../../assets/Projects.png";
import filamentsImage from "../../assets/Filament.png";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi"; // Importing right arrow icon
import { IoIosSettings } from "react-icons/io"; // Importing settings icon
import { Tooltip } from "react-tooltip"; // Importing tooltip component
import { toggleDarkMode } from "../../slices/themeSlice";
import { useDispatch } from "react-redux";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Correctly using useDispatch here
  const darkMode = useSelector((state) => state.theme.darkMode);

  const handleTileClick = (page) => {
    if (page === "filament") {
      navigate("/filaments");
    } else if (page === "projects") {
      navigate("/projects");
    }
  };

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200 dark:bg-gray-700 pb-20">
      {/* Top Bar */}
      <div className="flex flex-col items-center w-full px-4 py-2 pt-4">
        <img
          className="h-16 md:h-24"
          src={DashboardLogo}
          alt="3D Logbook Logo"
        />
        <h1 className="text-xl font-orbitron text-gray-800 dark:text-gray-200 md:text-3xl p-2">
          3D Logbook
        </h1>
      </div>

      {/* Content */}
      <div className="flex-grow flex items-center justify-center ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Projects Tile */}
          <div className="bg-violet-100 dark:bg-blue-700 rounded-lg shadow-md hover:bg-gray-900 dark:hover:bg-gray-900 cursor-pointer relative">
            <img
              src={projectsImage}
              alt="Projects"
              className="w-full h-48 md:h-64 object-cover rounded-t-lg"
            />
            <div
              onClick={() => handleTileClick("projects")}
              className="p-2 flex justify-between items-center"
            >
              <h2 className="text-lg font-bold font-orbitron text-blue-700 dark:text-gray-200 md:text-xl tracking-widest pt-8">
                PROJECTS
              </h2>
              <FiArrowRight className="text-2xl text-blue-700 dark:text-gray-200 absolute bottom-0 right-0 mb-2 mr-2" />
            </div>
          </div>

          {/* Filaments Tile */}
          <div
            onClick={() => handleTileClick("filament")}
            className="bg-lime-100 dark:bg-lime-800 rounded-lg shadow-md hover:bg-gray-900 dark:hover:bg-gray-900 cursor-pointer relative"
          >
            <img
              src={filamentsImage}
              alt="Filaments"
              className="w-full h-48 md:h-64 object-cover rounded-t-lg"
            />
            <div className="p-2 flex justify-between items-center">
              <h2 className="text-lg font-bold font-orbitron text-green-700 dark:text-gray-200 md:text-xl tracking-widest pt-8">
                FILAMENTS
              </h2>
            </div>
            {/* Positioned arrow icon at the bottom right */}
            <FiArrowRight className="text-2xl text-green-600 dark:text-gray-200 absolute bottom-0 right-0 mb-2 mr-2" />
          </div>
        </div>
      </div>

      {/* Command Center*/}
      <div className="fixed bottom-0 left-0 m-4 rounded-lg p-2 flex flex-col items-center space-y-2">
        <button
          data-tooltip-id="settings-tooltip" // specify tooltip id
          data-tooltip-content="Settings" // tooltip content
          className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 inline-flex items-center justify-center transition duration-200 w-full"
        >
          <IoIosSettings className="text-white" size={28} />
        </button>
        <button
          onClick={handleToggle}
          className={`flex items-center rounded-full justify-center p-2 transition duration-500 ease-in-out ${
            darkMode
              ? "bg-blue-600 text-yellow-400"
              : "bg-purple-500 text-yellow-400"
          }`}
          data-tooltip-id="darkmode-tooltip" // Add tooltip id
          data-tooltip-content={
            darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
          } // Add tooltip content
        >
          {darkMode ? <MdLightMode size={28} /> : <MdDarkMode size={28} />}
        </button>

        {/* Tooltip components */}
        <Tooltip id="settings-tooltip" place="right" effect="solid" />
        <Tooltip id="darkmode-tooltip" place="right" effect="solid" />
      </div>
    </div>
  );
};

export default Dashboard;
