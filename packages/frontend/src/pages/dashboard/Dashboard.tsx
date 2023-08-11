import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getUser } from "@helpers";

function Dashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>();

  const fetchUser = async () => {
    try {
      setUser(await getUser());
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      <Link to="/logout">logout</Link>
      {loading && <p>Loading...</p>}
      {!loading && !user && <p>Something went wrong fetching the user</p>}
      {!loading && user && <pre>User {JSON.stringify(user, null, 2)}</pre>}
    </div>
  );
}

export default Dashboard;
