import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";

function ConfirmSignUp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(false);

  const initEmail = location.search.match(/(?<=email=)(.*?)(?=&|$)/gi)?.[0] ?? "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;

    try {
      await Auth.confirmSignUp(initEmail, code);
      navigate(`/login?email=${initEmail}`);
    } catch (err) {
      setLoading(false);
      alert(err.message);
    }
  };

  const resendSignUpCode = async (email: string) => {
    try {
      await Auth.resendSignUp(email);
      alert("We sent you a new code");
    } catch (err) {
      alert("Failed sending you a new code");
    }
  };

  return (
    <>
      <h2>Confirm your account</h2>

      <p>
        You should have received a code on your email <strong>{initEmail}</strong>. Haven't received anything?{" "}
        <span onClick={() => resendSignUpCode(initEmail)} style={{ cursor: "pointer" }}>
          <u>Resend code</u>
        </span>
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" defaultValue={initEmail} name="email" id="email" disabled={true} required />
          <label htmlFor="code">Code</label>
          <input type="text" name="code" id="code" required autoComplete="false" />
        </div>
        <div>
          <Link to="/login">
            <button type="reset">Cancel</button>
          </Link>
          <input type="submit" value="Confirm account" disabled={loading} />
        </div>
      </form>
    </>
  );
}

export default ConfirmSignUp;
