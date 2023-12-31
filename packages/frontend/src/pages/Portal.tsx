import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useCognitoSession } from "@hooks";

function Portal() {
  const location = useLocation();
  const cognito = useCognitoSession();

  if (cognito.authenticated === true) return <Outlet />;
  if (cognito.authenticated === false) {
    return <Navigate to="/login" state={{ error: cognito.error, from: location }} />;
  }
  return <>Loading...</>;
}

export default Portal;
