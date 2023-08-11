import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";

function ConfirmNewPassword() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>();

  const initEmail = window.location.search.match(/(?<=email=)(.*?)(?=&|$)/gi)?.[0] ?? "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const code = formData.get("code") as string;
    const password = formData.get("password") as string;

    try {
      await Auth.forgotPasswordSubmit(email, code, password);
      navigate(`/login?email=${email}`);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Set a new password</h2>

      <p>If an account for your email address exists, you should receive a reset code in your email.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" defaultValue={initEmail} name="email" id="email" disabled={true} />
          <label htmlFor="code">Code</label>
          <input type="text" name="code" id="code" />
          <label htmlFor="password">New password</label>
          <input type="password" name="password" id="password" />
        </div>
        <div>
          <Link to="/login">
            <button type="reset">Cancel</button>
          </Link>
          <input type="submit" value="Confirm new password" disabled={loading} />
        </div>
      </form>
    </>
  );
}

export default ConfirmNewPassword;
