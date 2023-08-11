import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogoutCallback() {
  const navigate = useNavigate();
  const [time, setTime] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(time - 1);
    }, 1000);
    if (time === 0) navigate("/login");
    return () => clearTimeout(timer);
  }, [navigate, time]);

  return (
    <>
      <h2>Log out successful</h2>
      <p>Taking you back to Login screen in {time}.</p>
    </>
  );
}

export default LogoutCallback;
