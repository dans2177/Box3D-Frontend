import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import IntroBanner from "../assets/IntroBanner.png";

const SignInUp = () => {
  const { login, register } = useKindeAuth();

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 md:flex-initial md:w-1/3 bg-blue-500 p-4">
        <button
          className="bg-green-500 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={register}
          type="button"
        >
          Sign up
        </button>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={login}
          type="button"
        >
          Sign In
        </button>
      </div>

      <div className="hidden md:block md:w-2/3">
        <img
          src={IntroBanner}
          alt="Sign In Image"
          className="object-cover h-full w-full"
        />
      </div>
    </div>
  );
};

export default SignInUp;

