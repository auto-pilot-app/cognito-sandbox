import { useEffect } from "react";
import { Auth } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  const signOutUser = async () => {
    try {
      await Auth.signOut();
    } catch (err) {
      alert(err.message);
    } finally {
      return navigate("/logout/callback");
    }
  };

  useEffect(() => {
    signOutUser();
  }, []);

  return <h2>Logging out...</h2>;
}

export default Logout;
