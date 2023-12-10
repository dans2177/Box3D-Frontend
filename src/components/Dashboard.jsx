import { useState } from "react";
import DashboardLogo from "../assets/DashboardLogo.gif";
import projectsImage from "../assets/Projects.png"; // Import your projects image
import filamentsImage from "../assets/Filament.png"; // Import your filaments image

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("");

  const handleTileClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div className="relative h-screen flex flex-col items-center justify-center pt-48 px-4 lg:px-20">
      <div className="absolute top-0 flex flex-col items-center w-full p-4 m-4 max-w-6xl mx-auto">
        <img className="h-36" src={DashboardLogo} alt="3D Logbook Logo" />
        <h1 className="text-center text-4xl p-2 font-sans">Box3D</h1>
        <p className="text-center text-lg p-2 font-sans">
          More features coming soon!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl mx-auto">
        {/* Projects Tile */}
        <div
          className="flex flex-col justify-start items-center bg-gray-200 p-4 rounded-lg shadow-md hover:bg-gray-300 cursor-pointer"
          onClick={() => handleTileClick("projects")}
        >
          <div className="w-full  overflow-hidden rounded-t-lg">
            <img
              src={projectsImage}
              alt="Projects"
              className="w-full h-full object-cover aspect-square"
            />
          </div>
          <h2 className="text-2xl mt-4 mb-2 text-center font-sans">Projects</h2>
        </div>

        {/* Filaments Tile */}
        <div
          className="flex flex-col justify-start items-center bg-gray-200 p-4 rounded-lg shadow-md hover:bg-gray-300 cursor-pointer"
          onClick={() => handleTileClick("filaments")}
        >
          <div className="w-full overflow-hidden rounded-t-lg">
            <img
              src={filamentsImage}
              alt="Filaments"
              className="w-full h-full object-cover aspect-square"
            />
          </div>
          <h2 className="text-2xl mt-4 mb-2 text-center font-sans">
            Filaments
          </h2>
        </div>
      </div>
      {activeComponent === "projects" && <div>Projects Logbook</div>}
      {activeComponent === "filaments" && <div>Filament</div>}
    </div>
  );
};

export default Dashboard;
