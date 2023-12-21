import AuthenticationForm from "./components/Others/AuthenticationForm.jsx";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import Dashboard from "./components/Others/Dashboard.jsx";
import LoadingComponent from "./components/Others/Loading.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InventoryView from "./components/Filament/InventoryView.jsx";
import FilamentForm from "./components/Filament/FilamentForm.jsx";
import SingleFilament from "./components/Filament/SingleFilament.jsx";

function App() {
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
    </Router>
  );
}

export default App;
