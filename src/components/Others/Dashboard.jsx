import DashboardLogo from "../../assets/DashboardLogo.gif";
import projectsImage from "../../assets/Projects.png";
import filamentsImage from "../../assets/Filament.png";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi"; // Importing right arrow icon

const Dashboard = () => {
  const navigate = useNavigate();

  const handleTileClick = (page) => {
    if (page === "filament") {
      navigate("/filaments");
    } else if (page === "projects") {
      navigate("/projects");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
      <div className="flex flex-col items-center w-full px-4 py-2 bg-white  fixed top-0 z-10">
        <img
          className="h-16 md:h-24"
          src={DashboardLogo}
          alt="3D Logbook Logo"
        />
        <h1 className="text-xl md:text-3xl p-2 font-sans">3D Logbook</h1>
      </div>

      {/* Content */}
      <div className="flex-grow flex items-center justify-center pt-28 md:pt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Projects Tile */}
          <div className="bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 cursor-pointer relative">
            <img
              src={projectsImage}
              alt="Projects"
              className="w-full h-48 md:h-64 object-cover rounded-t-lg"
            />
            <div
              onClick={() => handleTileClick("projects")}
              className="p-2 flex justify-between items-center"
            >
              <h2 className="text-lg md:text-xl font-sans">Projects</h2>
              <FiArrowRight className="text-2xl" />
            </div>
          </div>

          {/* Filaments Tile */}
          <div
            onClick={() => handleTileClick("filament")}
            className="bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 cursor-pointer relative"
          >
            <img
              src={filamentsImage}
              alt="Filaments"
              className="w-full h-48 md:h-64 object-cover rounded-t-lg"
            />
            <div className="p-2 flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-sans">Filaments</h2>
              <FiArrowRight className="text-2xl" />
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm md:text-md p-2 font-sans text-center pb-8">
        More features coming soon!
      </p>
    </div>
  );
};

export default Dashboard;
