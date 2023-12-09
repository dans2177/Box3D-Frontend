import { FaPrint } from "react-icons/fa"; // Importing a 3D printer icon from React Icons

const LoadingComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <div className="text-6xl mb-5 text-gray-200">
        <FaPrint />
      </div>
      <div className="w-1/2 bg-gray-300 h-6 rounded-full overflow-hidden">
        <div className="bg-green-500 h-full rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingComponent;
