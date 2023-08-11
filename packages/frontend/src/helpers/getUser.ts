import { Auth } from "@aws-amplify/auth";

/**
 * Stub function to return the authenticated cognito user
 * @returns cognito user
 */
export async function getUser() {
  const rawUser = await Auth.currentAuthenticatedUser();
  console.log(rawUser);
  return formatUser(rawUser);
}

function formatUser(user: any) {
  return {
    username: user.username,
    attributes: user.attributes,
  };
}
