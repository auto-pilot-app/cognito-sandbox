import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";

function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(null);

  const initEmail = location.search.match(/(?<=email=)(.*?)(?=&|$)/gi)?.[0] ?? "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      await Auth.forgotPassword(email ?? initEmail);
      navigate(`/confirm-password?email=${email ?? initEmail}`);
    } catch (err) {
      setLoading(false);
      alert(err.message);
    }
  };

  return (
    <>
      <h2>Reset your password</h2>

      <p>
        To reset your password, enter your email below and submit. An email will be sent to you with instructions on how
        to complete the process.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" defaultValue={initEmail} name="email" id="email" />
        </div>
        <div>
          <Link to="/login">
            <button type="reset">Cancel</button>
          </Link>
          <input type="submit" value="Reset password" disabled={loading} />
        </div>
      </form>
    </>
  );
}

export default ForgotPassword;
