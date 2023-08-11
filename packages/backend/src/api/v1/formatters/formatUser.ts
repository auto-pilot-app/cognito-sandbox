export function formatUser(cognitoUser: any) {
  return {
    ...cognitoUser,
    full_name: `${cognitoUser.given_name} ${cognitoUser.family_name}`,
  };
}
