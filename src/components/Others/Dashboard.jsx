import DashboardLogo from "../../assets/DashboardLogo.gif";
import projectsImage from "../../assets/Projects.png";
import filamentsImage from "../../assets/Filament.png";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi"; // Importing right arrow icon
import { IoMdLogOut } from "react-icons/io"; // Importing settings icon
import { Tooltip } from "react-tooltip"; // Importing tooltip component
import { toggleDarkMode } from "../../slices/themeSlice";
import { useDispatch } from "react-redux";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useSelector } from "react-redux";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { IoCloudDownloadOutline } from "react-icons/io5";

import DashboardLogoDark from "../../assets/DashboardDark.gif";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Correctly using useDispatch here
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { logout } = useKindeAuth();

  const handleTileClick = (page) => {
    if (page === "filament") {
      navigate("/filaments");
    } else if (page === "projects") {
      navigate("/projects");
    }
  };
  const logoSrc = darkMode ? DashboardLogoDark : DashboardLogo;

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200 dark:bg-gray-700 pb-20">
      {/* Top Bar */}
      <div className="flex flex-col items-center w-full px-4 py-2 pt-4">
        <img className="h-16 md:h-24" src={logoSrc} alt="3D Logbook Logo" />
        <h1 className="text-xl font-orbitron text-gray-800 dark:text-gray-200 md:text-3xl p-2">
          3D Logbook
        </h1>
      </div>

      {/* Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-1 max-w-lg md:grid-cols-2 gap-4 mx-auto px-2 sm:px-4">
          {/* Filaments Tile */}
          <div
            onClick={() => handleTileClick("filament")}
            className="w-60 bg-lime-100 dark:bg-lime-800 rounded-lg shadow-md hover:bg-gray-900 dark:hover:bg-gray-900 cursor-pointer relative mx-2 sm:mx-1"
          >
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={filamentsImage}
                alt="Filaments"
                className="object-cover rounded-t-lg"
              />
            </div>
            <div className="p-2 flex justify-between items-center">
              <h2 className="text-lg font-bold font-orbitron text-green-700 dark:text-gray-200 md:text-xl tracking-widest pt-8">
                FILAMENT
              </h2>
            </div>
            {/* Positioned arrow icon at the bottom right */}
            <FiArrowRight className="text-2xl text-green-600 dark:text-gray-200 absolute bottom-0 right-0 mb-2 mr-2" />
          </div>

          {/* Projects Tile */}
          <div className="w-60 bg-violet-100 dark:bg-blue-700 rounded-lg shadow-md hover:bg-gray-900 dark:hover:bg-gray-900 cursor-pointer relative mx-2 sm:mx-1">
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={projectsImage}
                alt="Projects"
                className="object-cover rounded-t-lg"
              />
            </div>
            {/* Overlay */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg">
              <span className="text-white tracking-widest text-xl">
                Coming Soon
              </span>
            </div>

            <div className="p-2 flex justify-between items-center">
              <h2 className="text-lg font-bold font-orbitron text-blue-700 dark:text-gray-200 md:text-xl tracking-widest pt-8">
                PROJECTS
              </h2>
              <FiArrowRight className="text-2xl text-blue-700 dark:text-gray-200 absolute bottom-0 right-0 mb-2 mr-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Command Center*/}
      <div className="fixed bottom-0 left-0 m-4 rounded-lg p-2 flex flex-col items-center space-y-2">
        <button
          className={`flex items-center rounded-full justify-center p-2 transition duration-500 ease-in-out ${
            darkMode
              ? "bg-green-600 text-yellow-200"
              : "bg-green-500 text-yellow-200"
          }`}
          data-tooltip-id="darkmode-tooltip"
          data-tooltip-content={"Download Inventory Clips..."}
          onClick={() =>
            window.open("https://makerworld.com/en/models/151555", "_blank")
          }
        >
          <IoCloudDownloadOutline size={28} />
        </button>

        <button
          onClick={handleToggle}
          className={`flex items-center rounded-full justify-center p-2 transition duration-500 ease-in-out ${
            darkMode
              ? "bg-blue-600 text-yellow-400"
              : "bg-purple-500 text-yellow-400"
          }`}
          data-tooltip-id="darkmode-tooltip"
          data-tooltip-content={
            darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
          } // Add tooltip content
        >
          {darkMode ? <MdLightMode size={28} /> : <MdDarkMode size={28} />}
        </button>
        <button
          onClick={() => logout()}
          data-tooltip-id="settings-tooltip"
          data-tooltip-content="Logout" // tooltip content
          className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 inline-flex items-center justify-center transition duration-200 w-full"
        >
          <IoMdLogOut className="text-white" size={28} />
        </button>
        {/* Tooltip components */}
        <Tooltip id="settings-tooltip" place="right" effect="solid" />
        <Tooltip id="darkmode-tooltip" place="right" effect="solid" />
      </div>
    </div>
  );
};

export default Dashboard;
