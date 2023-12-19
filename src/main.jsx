import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { store } from "./slices/Store.jsx"; // Adjust the import path as necessary
import { Provider } from "react-redux";
import Modal from "react-modal"; // Import Modal from react-modal
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

Modal.setAppElement("#root"); // Set the app element to the root element of your application
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
    onRedirectCallback={onRedirectCallback}
  >
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />

      <App />
    </Provider>
  </KindeProvider>
);
