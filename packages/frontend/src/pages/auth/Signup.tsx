import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";

import { GoogleAuthButton } from "@components";

function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const termsAccepted = formData.get("terms");
    if (!termsAccepted) {
      setLoading(false);
      return alert("Must accept the terms");
    }

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await Auth.signUp({
        username: email.toLowerCase().trim(),
        password,
        attributes: { given_name: firstName.trim(), family_name: lastName.trim() },
      });
      console.log(response);
      if (!response.userConfirmed) return navigate(`/confirm-account?email=${email}`);
      navigate(`/login?email=${email}`);
    } catch (err) {
      console.log(err);
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Create your account</h2>

      <GoogleAuthButton content="Create account with Google" />

      <div className="Auth__separator"></div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First name</label>
          <input type="text" name="firstName" id="firstName" />

          <label htmlFor="lastName">Last name</label>
          <input type="text" name="lastName" id="lastName" />

          <label htmlFor="email">Email</label>
          <input type="text" name="email" id="email" />

          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />

          <input type="checkbox" name="terms" id="terms" />
          <label htmlFor="terms">Accept terms</label>
        </div>
        <div>
          <Link to="/login">
            <button type="reset">Cancel</button>
          </Link>
          <input type="submit" value="Create account" disabled={loading} />
        </div>
      </form>
    </>
  );
}

export default Signup;
