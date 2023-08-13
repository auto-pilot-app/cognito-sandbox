import { useEffect, useState, useCallback } from "react";
import { Auth } from "@aws-amplify/auth";

/**
 * This hook is used by the Portal.tsx component to verify the auth
 * status on every top-level render.
 */
export const useCognitoSession = () => {
  const [cognito, setCognito] = useState<{ authenticated: boolean | null; error: string | null }>({
    authenticated: null,
    error: null,
  });

  const refreshSession = useCallback(async () => {
    try {
      await Auth.currentSession();
      setCognito({ authenticated: true, error: null });
    } catch (err) {
      console.log(err);
      if (err !== "No current user") {
        await Auth.signOut();
        return setCognito({ authenticated: false, error: err.message });
      }
      setCognito({ authenticated: false, error: "You are signed out!" });
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return cognito;
};
