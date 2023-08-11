import { logos } from "@assets";

import "./GoogleAuthButton.scss";

type Props = {
  content: string;
};

export function GoogleAuthButton({ content }: Props) {
  return (
    <a
      href={`https://${import.meta.env.VITE_AUTH_DOMAIN}/oauth2/authorize?identity_provider=Google&redirect_uri=${
        import.meta.env.VITE_URL
      }/login/callback&response_type=CODE&client_id=${
        import.meta.env.VITE_AWS_COGNITO_WEBCLIENTID
      }&scope=aws.cognito.signin.user.admin%20email%20openid%20phone%20profile`}
    >
      <button className="GoogleButton">
        <div className="GoogleButton__logo">
          <logos.GoogleLogo />
        </div>
        <div className="GoogleButton__content">{content}</div>
      </button>
    </a>
  );
}
