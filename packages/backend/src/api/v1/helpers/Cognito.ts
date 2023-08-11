import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";

const CognitoISP = new CognitoIdentityProvider({ region: process.env.AWS_REGION });

export async function getCognitoUser(AccessToken: string): Promise<Record<string, string>> {
  const cognitoUser = await CognitoISP.getUser({ AccessToken });

  if (!cognitoUser) throw new Error("NO_PROFILE");

  if (!cognitoUser.UserAttributes) return { sub: cognitoUser.Username };

  // Map attributes to object
  const user: Record<string, string> = cognitoUser.UserAttributes.reduce(
    (acc, { Name, Value }) => (acc = { ...acc, [Name as string]: Value }),
    {}
  );

  // Return cognito user with attributes as key value pairs
  return user;
}
