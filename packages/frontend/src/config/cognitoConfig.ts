export const cognitoConfig = {
  Auth: {
    mandatorySignId: true,
    region: import.meta.env.VITE_AWS_COGNITO_REGION,
    userPoolId: import.meta.env.VITE_AWS_COGNITO_USERPOOLID,
    userPoolWebClientId: import.meta.env.VITE_AWS_COGNITO_WEBCLIENTID,
    identityPoolId: import.meta.env.VITE_AWS_CONGITO_IDENTITYPOOL_ID,
    oauth: {
      domain: import.meta.env.VITE_AUTH_DOMAIN,
      scope: ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"],
      redirectSignIn: `${import.meta.env.VITE_FRONTEND_URL}/login/callback`,
      redirectSignOut: `${import.meta.env.VITE_FRONTEND_URL}/logout/callback`,
      responseType: "code",
    },
  },
};
