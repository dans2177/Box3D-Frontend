import SignInUp from "./components/Others/SignInUp.jsx";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import Dashboard from "./components/Others/Dashboard.jsx";
import LoadingComponent from "./components/Others/Loading.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InventoryView from "./components/Filament/InventoryView.jsx";

function App() {
  const { isAuthenticated, isLoading, getToken } = useKindeAuth();

  if (isLoading) return <LoadingComponent />;
  if (!isAuthenticated) return <SignInUp />;
  if (isAuthenticated) console.log(getToken());
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/filaments" element={<InventoryView />} />
      </Routes>
    </Router>
  );
}

export default App;
