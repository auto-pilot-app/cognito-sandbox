import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";

import { PhoneVerificationModal } from "@components/modals";
import { getUser } from "@helpers";

import "./Dashboard.scss";

function Dashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>();
  const [phoneState, setPhoneState] = useState<PhoneState>("UNKNOWN");

  const dialogRef = useRef<HTMLDialogElement>();

  const setPhoneNumber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const tel = formData.get("tel") as string;

    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, { phone_number: tel });
      await promptPhoneVerification();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const promptPhoneVerification = async () => {
    try {
      dialogRef.current.open = true;
      await Auth.verifyCurrentUserAttribute("phone_number");
      setPhoneState("CODE_SENT");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const verifyPhone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const code = formData.get("code") as string;

    try {
      await Auth.verifyCurrentUserAttributeSubmit("phone_number", code);
      setPhoneState("VERIFIED");
      form.reset();
      dialogRef.current.open = false;
      await fetchUser();
    } catch (err) {
      if (err.code === "ExpiredCodeException") {
        form.reset();
        return setPhoneState("CODE_EXPIRED");
      } else if (err.code === "CodeMismatchException") {
        return setPhoneState("INVALID_CODE");
      } else if (err.code === "LimitExceededException") {
        return setPhoneState("LIMIT_EXCEEDED");
      }
      console.error(err);
      alert(err.message);
    }
  };

  const setMFA = (option: "NOMFA" | "SMS") => async (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    button.disabled = true;
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.setPreferredMFA(user, option);
      await fetchUser();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    button.disabled = false;
  };

  const fetchUser = async () => {
    try {
      const user = await getUser();
      user.identities = user.identities ? JSON.parse(user.identities) : [];
      user.isFederated = user.identities[0]?.providerName === "Google";
      if (!user.isFederated) {
        const authUser = await Auth.currentAuthenticatedUser();
        const mfa = await Auth.getPreferredMFA(authUser);
        user.mfaSetting = mfa;
      }
      setPhoneState(!user.phone_number ? "NOT_SET" : user.phone_number_verified === "true" ? "VERIFIED" : "UNVERIFIED");
      setUser(user);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    (async () => {
      const resp = await Auth.fetchDevices();
      console.log(resp);
    })();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>

      <Link to="/logout">
        <button>Logout</button>
      </Link>

      {loading && <p>Loading...</p>}
      {!loading && !user && <p>Something went wrong fetching the user</p>}

      {user && (
        <>
          {/* USER PROFILE */}
          <section>
            <h4>Profile</h4>
            <pre>User {JSON.stringify(user, null, 2)}</pre>
          </section>

          {/* MFA */}
          <section>
            <h4>SMS MFA</h4>

            {user.isFederated && <blockquote>Your account is managed by Google</blockquote>}

            {!user.isFederated && (
              <div className="MFA">
                <form onSubmit={setPhoneNumber}>
                  <div>
                    <label htmlFor="tel">
                      Phone number {!["NOT_SET", "VERIFIED"].includes(phoneState) && <>(UNVERIFIED)</>}
                    </label>
                    <input type="tel" defaultValue={user.phone_number ?? ""} name="tel" id="tel" required />
                  </div>
                  <div>
                    <input type="submit" value={`${phoneState === "NOT_SET" ? "Set" : "Update"} phone number`} />
                    {!["NOT_SET", "VERIFIED"].includes(phoneState) && (
                      <button type="button" onClick={promptPhoneVerification}>
                        Verify phone number
                      </button>
                    )}
                  </div>
                </form>

                <PhoneVerificationModal
                  dialogRef={dialogRef}
                  phoneState={phoneState}
                  verifyPhone={verifyPhone}
                  resendCode={promptPhoneVerification}
                />

                <p>
                  MFA is currently <strong>{user.mfaSetting === "SMS_MFA" ? "enabled" : "disabled"}</strong>
                </p>

                {user.mfaSetting === "SMS_MFA" && <button onClick={setMFA("NOMFA")}>Disable SMS MFA</button>}

                {user.mfaSetting !== "SMS_MFA" && (
                  <button onClick={setMFA("SMS")} disabled={phoneState !== "VERIFIED"}>
                    Enable SMS MFA
                  </button>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;
