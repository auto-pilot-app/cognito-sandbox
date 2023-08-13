import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";

import { GoogleAuthButton } from "@components/buttons";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [challenge, setChallenge] = useState<"SMS_MFA">();
  const [pendingUser, setPendingUser] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const initEmail = location.search.match(/(?<=email=)(.*?)(?=&|$)/gi)?.[0] ?? "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const user = await Auth.signIn({ username: email, password });
      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        // Implement password reset steps
      } else if (user.challengeName === "SMS_MFA") {
        setPendingUser(user);
        setChallenge("SMS_MFA");
      } else if (user.challengeName === "SOFTWARE_TOKEN_MFA") {
        // Implement auth mfa steps
      } else {
        return navigate("/dashboard");
      }
    } catch (err) {
      if (err.code === "UserNotConfirmedException") return navigate(`/confirm-account?email=${initEmail}`);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;

    try {
      await Auth.confirmSignIn(pendingUser, code, "SMS_MFA");
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Login</h2>

      <p>
        Don't have an account?{" "}
        <Link to="/signup">
          <strong>Sign Up</strong>
        </Link>
      </p>

      <form onSubmit={challenge === "SMS_MFA" ? confirmSignIn : handleSubmit}>
        <div>
          {!challenge && (
            <>
              <label htmlFor="email">Email</label>
              <input type="email" defaultValue={initEmail} name="email" id="email" required />
              <label htmlFor="password">Password</label>
              <input type="password" name="password" id="password" required />
              <Link to="/forgot-password">forgot password?</Link>
            </>
          )}
          {challenge === "SMS_MFA" && (
            <>
              <blockquote>
                You should have received a SMS code on{" "}
                <strong>{pendingUser.challengeParam.CODE_DELIVERY_DESTINATION}</strong>.
              </blockquote>
              <label htmlFor="code">SMS Code</label>
              <input type="text" name="code" id="code" required />
            </>
          )}
        </div>
        <div>
          {challenge === "SMS_MFA" ? <button onClick={() => setChallenge(undefined)}>Cancel</button> : <span></span>}
          <input type="submit" value={challenge === "SMS_MFA" ? "Confirm code" : "Login"} disabled={loading} />
        </div>
      </form>

      <GoogleAuthButton content="Log in with Google" />
    </>
  );
}

export default Login;
