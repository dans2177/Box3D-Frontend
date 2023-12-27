import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import IntroBanner from "../../assets/IntroBanner.png";

const AuthenticationForm = () => {
  const { login, register } = useKindeAuth();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-200 text-gray-800">
      <div className="flex-1 md:flex-initial md:w-1/3 flex flex-col justify-center items-center p-4">
        <h1 className="text-4xl mb-8">Welcome to 3D Logbook</h1>
        <button
          className="bg-transparent border-green-600 text-green-600 border font-bold py-3 px-6 rounded mb-4 hover:bg-green-600 hover:text-white transition-colors"
          onClick={register}
          type="button"
        >
          Start Tracking
        </button>
        <button
          className="bg-transparent border-blue-600 text-blue-600 border font-bold py-3 px-6 rounded hover:bg-blue-600 hover:text-white transition-colors"
          onClick={login}
          type="button"
        >
          Sign In
        </button>
      </div>

      <div className="hidden md:flex md:w-2/3 items-center justify-center">
        <img
          src={IntroBanner}
          alt="Sign In Banner"
          className="object-cover h-full w-full "
        />
      </div>
    </div>
  );
};

export default AuthenticationForm;
