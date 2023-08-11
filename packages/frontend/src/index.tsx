import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";
import { cognitoConfig } from "./config/cognitoConfig";

import App from "./App";

import "./normalize.css";
import "./index.scss";

Auth.configure(cognitoConfig);

const Root = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <App />
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementsByTagName("autopilot")[0]);
root.render(<Root />);
