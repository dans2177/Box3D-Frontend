import React from "react";
import SignInUp from "./components/SignInUp.jsx";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  const { isAuthenticated, isLoading, getToken } = useKindeAuth();

  if (isLoading) return <>Loading...</>;
  if (isAuthenticated) return <Dashboard />;
  if (isAuthenticated) console.log(getToken());
  return <SignInUp />;
}

export default App;
