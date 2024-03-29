import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import DashboardLogo from "../../assets/AuthBanner.png";
import SmallScreenGif from "../../assets/DashboardLogo.gif";

const AuthenticationForm = () => {
  const { login, register } = useKindeAuth();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-200">
      {/* Left Side - Welcome Text, Buttons, and Small Screen GIF */}
      <div className="flex flex-col w-full min-h-screen lg:w-1/2 justify-between items-center p-10 bg-white">
        {/* Small Screen GIF */}
        <div className="lg:hidden h-40 w-40 mb-4">
          <img
            src={SmallScreenGif} // Replace with your GIF for small screens
            alt="3D Logbook Small Screen"
            className="h-full w-full object-cover" // Added rounded-full for a circular shape, remove if not needed
          />
        </div>
        <div className="lg:mt-20">
          <h1 className="text-4xl text-center lg:text-6xl font-bold mb-4 font-orbitron">
            Welcome to 3D Logbook <br/> (Beta)
          </h1>
          <p className="text-xl  text-center lg:text-2xl mb-8">
            Your personal inventory manager.
          </p>
        </div>
        <div className="">
          <button
            onClick={login}
            className="border-4 border-blue-500 text-blue-500 font-bold py-3 m-4 px-6 rounded hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out mb-4 text-lg lg:text-xl custom-font"
          >
            Login
          </button>
          <button
            onClick={register}
            className="border-4 border-orange-500 text-orange-500 m-4 hover:text-white font-bold py-3 px-6 rounded hover:bg-orange-500 transition duration-300 ease-in-out text-lg lg:text-xl custom-font"
          >
            Sign Up
          </button>
        </div>
        <p className="text-center text-gray-500 mt-4">
          More features coming soon
        </p>
      </div>

      {/* Right Side - Large Image for large screens */}
      <div className="hidden lg:block w-1/2 h-auto  items-center justify-center bg-gray-800">
        <img
          src={DashboardLogo} // Replace with your large screen image
          alt="3D Logbook"
          className="object-cover h-full w-full"
        />
      </div>
    </div>
  );
};

export default AuthenticationForm;
