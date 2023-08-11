import { Navigate, Outlet, useLocation } from "react-router-dom";

import { logos } from "@assets";
import { useCognitoSession } from "@hooks";

import "./Auth.scss";

function Authentication() {
  const location = useLocation();
  const cognito = useCognitoSession();

  if (cognito.authenticated && !["/logout", "/logout/callback"].includes(location.pathname)) {
    return <Navigate to="/" />;
  }

  return (
    <section className="Auth">
      <div className="Auth__wrapper">
        <header>
          <img src={logos.Autopilot} />
        </header>
        <main>
          <Outlet />
        </main>
        <footer>
          <a href="#" target="_blank" rel="noreferrer">
            Terms &amp; Conditions
          </a>
          <a href="#" target="_blank" rel="noreferrer">
            Privacy Statement
          </a>
        </footer>
      </div>
    </section>
  );
}

export default Authentication;
