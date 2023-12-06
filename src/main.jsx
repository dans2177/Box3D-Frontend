import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

const onRedirectCallback = (user, app_state) => {
  console.log({ user, app_state });
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <KindeProvider
    clientId="ff3837a9ea2c48a4ab002a976ece680a"
    domain="https://shemonindustries.kinde.com"
    logoutUri="http://localhost:5173/"
    redirectUri="http://localhost:5173/"
    audience="https://thebox3d.com"
    onRedirectCallback={onRedirectCallback} // Add this line
  >
    <App />
  </KindeProvider>
);
