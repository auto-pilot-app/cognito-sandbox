import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";

import { GoogleAuthButton } from "@components";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(false);

  const initEmail = location.search.match(/(?<=email=)(.*?)(?=&|$)/gi)?.[0] ?? "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await Auth.signIn({ username: email, password });

      if (response.challengeName === "NEW_PASSWORD_REQUIRED") {
        // Implement password reset steps
      } else if (response.challengeName === "SMS_MFA") {
        // Implement sms mfa steps
      } else if (response.challengeName === "SOFTWARE_TOKEN_MFA") {
        // Implement auth mfa steps
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.code === "UserNotConfirmedException") return navigate(`/confirm-account?email=${initEmail}`);
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Login</h2>

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          <strong>Sign Up</strong>
        </Link>
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" defaultValue={initEmail} name="email" id="email" />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
          <Link to="/forgot-password">forgot password?</Link>
        </div>
        <div>
          <span></span>
          <input type="submit" value="Login" disabled={loading} />
        </div>
      </form>

      <GoogleAuthButton content="Log in with Google" />
    </>
  );
}

export default Login;
