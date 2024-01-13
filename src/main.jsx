import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { store } from "./slices/Store.jsx"; // Adjust the import path as necessary
import { Provider } from "react-redux";
import Modal from "react-modal"; // Import Modal from react-modal
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

Modal.setAppElement("#root"); // Set the app element to the root element of your application
const onRedirectCallback = (user, app_state) => {
  console.log({ user, app_state });
};

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <KindeProvider
    clientId="ff3837a9ea2c48a4ab002a976ece680a"
    domain="https://shemonindustries.kinde.com"
    logoutUri="https://www.3dlogbook.com/"
    redirectUri="https://www.3dlogbook.com/"
    audience="https://thebox3d.com"
    onRedirectCallback={onRedirectCallback}
    //DO NOT USE BELOW IN PRODUCTION SET CUSTOM DOMAIN!!!!
    isDangerouslyUseLocalStorage={true}
  >
    <Provider store={store}>
    
      <App />
    </Provider>
  </KindeProvider>
);
