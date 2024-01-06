import DashboardLogo from "../../assets/Loading.gif";

const LoadingComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 dark:bg-gray-700">
      <div className="text-6xl mb-5 text-gray-200">
        <img
          className="h-24 md:h-"
          src={DashboardLogo}
          alt="3D Logbook Logo"
        />
      </div>
    </div>
  );
};

export default LoadingComponent;
