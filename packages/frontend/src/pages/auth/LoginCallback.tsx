import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginCallback() {
  const navigate = useNavigate();

  const callbackSession = async () => {
    try {
      navigate("/");
    } catch (err) {
      navigate("/login?message=Error signing in with Google");
    }
  };

  useEffect(() => {
    callbackSession();
  }, []);

  return <h2>Logging in...</h2>;
}

export default LoginCallback;
