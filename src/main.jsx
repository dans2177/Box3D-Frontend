import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { store } from "./slices/Store.jsx"; // Adjust the import path as necessary
import { Provider } from "react-redux";
import Modal from "react-modal"; // Import Modal from react-modal
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import { redirect } from "react-router-dom";

Modal.setAppElement("#root"); // Set the app element to the root element of your application
const onRedirectCallback = () => {
  redirect("/");
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <KindeProvider
    clientId="ff3837a9ea2c48a4ab002a976ece680a"
    domain="https://account.3dlogbook.com"
    logoutUri="https://www.3dlogbook.com/"
    redirectUri="https://www.3dlogbook.com/"
    audience="https://thebox3d.com"
    onRedirectCallback={onRedirectCallback}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </KindeProvider>
);
