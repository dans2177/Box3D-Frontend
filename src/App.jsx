import AuthenticationForm from "./components/Others/AuthenticationForm.jsx";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import Dashboard from "./components/Others/Dashboard.jsx";
import LoadingComponent from "./components/Others/Loading.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InventoryView from "./components/Filament/InventoryView.jsx";
import FilamentForm from "./components/Filament/FilamentForm.jsx";
import SingleFilament from "./components/Filament/SingleFilament.jsx";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

function App() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const toastContainerTheme = darkMode ? "dark" : "light";

  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const { isAuthenticated, isLoading, getToken } = useKindeAuth();

  if (isLoading) return <LoadingComponent />;

  if (!isAuthenticated) return <AuthenticationForm />;
  if (isAuthenticated) console.log(getToken());
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/filaments" element={<InventoryView />} />
        <Route path="/filaments/add" element={<FilamentForm />} />
        <Route path="/filament/:filamentId" element={<SingleFilament />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme={toastContainerTheme}
      />
    </Router>
  );
}

export default App;
