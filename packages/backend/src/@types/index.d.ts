import type { JWK } from "jwk-to-pem";

declare global {
  namespace Express {
    export interface Request {
      user: any;
    }
  }

  type CognitoJWK = JWK & { kid: string };

  type Pems = { [kid: string]: string };
}
