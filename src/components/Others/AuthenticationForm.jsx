import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import DashboardLogo from "../../assets/DashboardLogo.gif";
import LoginIcon from "../../assets/LoginIcon.png";
import SignUpIcon from "../../assets/SignUpIcon.png";
import { FiArrowRight } from "react-icons/fi"; // Importing right arrow icon

const AuthenticationForm = () => {
  const { login, register } = useKindeAuth();

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Top Bar */}
      <div className="flex flex-col items-center w-full px-4 py-2  fixed top-0 z-10">
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
          <div className="bg-gray-800 rounded-lg shadow-md hover:bg-gray-900 cursor-pointer relative">
            <img
              src={LoginIcon}
              alt="Login"
              className="w-full h-48 md:h-64 object-cover rounded-t-lg"
            />
            <div
              onClick={login}
              className="p-2 flex justify-between items-center"
            >
              {/* Adjust the text coloring to match the icon's color */}
              <h2
                className="text-lg md:text-xl font-sans pt-8"
                style={{ color: "#00B4D8" }}
              >
                Login
              </h2>
              <FiArrowRight
                className="text-2xl absolute bottom-0 right-0 mb-2 mr-2"
                style={{ color: "#00B4D8" }}
              />
            </div>
          </div>

          <div
            onClick={register}
            className="bg-gray-800 rounded-lg shadow-md hover:bg-gray-900 cursor-pointer relative"
          >
            <img
              src={SignUpIcon}
              alt="Start Tracking"
              className="w-full h-48 md:h-64 object-cover rounded-t-lg"
            />
            <div className="p-2 flex justify-between items-center">
              {/* Adjust the text coloring to match the icon's color */}
              <h2
                className="text-lg md:text-xl font-sans pt-8"
                style={{ color: "#FFA500" }}
              >
                Start Tracking
              </h2>
            </div>
            <FiArrowRight
              className="text-2xl absolute bottom-0 right-0 mb-2 mr-2"
              style={{ color: "#FFA500" }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AuthenticationForm;
