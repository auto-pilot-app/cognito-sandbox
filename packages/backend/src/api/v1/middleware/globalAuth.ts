import { Request, Response, NextFunction } from "express";
import jwkToPem from "jwk-to-pem";
import jwt from "jsonwebtoken";
import axios from "axios";

import { cache } from "../../../config/cache";
import { Cognito } from "../helpers";

export async function globalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.headers.authorization) throw new Error("No request headers specified");
    const token = req.headers.authorization.split(" ")[1];

    req.user = await getUserFromCache(token);

    next();
  } catch (err) {
    next(err);
  }
}

async function getUserFromCache(token: string) {
  const cachedUser: string = cache.get(token);
  if (cachedUser) return JSON.parse(cachedUser);

  const user = await getUserForToken(token);

  cache.set(token, JSON.stringify(user), 15 * 60); // Cache a user for 15 minutes
  return user;
}

async function getUserForToken(token: string) {
  /**
   * ~~The verify token function is not really necessary as Cognito.getCognitoUser() will already
   * verify if the token is valid, hasnt expired yet and in turn will return a valid CognitoUser.
   * What it does not tell you, is what Userpool this token and user belong to. If this is important
   * to know what userpool a user is authenticating from, then you would want to use this custom verifyToken
   * function which decodes the token and retrieves said information. But again: if your api only has access
   * to one user pool, then you do not have to be afraid that users from different user pools access your api.~~
   */
  //~~~~//
  const decodedJwt = jwt.decode(token, { complete: true });
  if (!decodedJwt) throw Error("JWT Token not valid");

  await verifyToken(token, decodedJwt);
  //~~~~//

  const user = await Cognito.getCognitoUser(token);

  return user;
}

// Helper functions that validate the JSON token

async function verifyToken(token: string, decodedJwt: jwt.Jwt) {
  const { iss } = decodedJwt.payload as jwt.JwtPayload;

  if (!iss) throw new Error();
  if (iss.split(/\//g)[3] !== process.env.AWS_COGNITO_USERPOOL)
    throw new Error("User does not belong to this user pool");

  const { data } = await axios.get(`${iss}/.well-known/jwks.json`);

  const pems = await getPems(data);
  const kid = decodedJwt.header.kid;
  if (!kid) throw new Error("KID_MISSING");
  const pem = pems[kid];
  const params = { token, pem, iss, maxAge: 60 * 60 * 1000 };

  jwt.verify(token, pem, { issuer: params.iss });
}

async function getPems(data: { keys: CognitoJWK[] }): Promise<Pems> {
  const pems: Pems = {};
  data.keys.map((key) => {
    const pem = jwkToPem(key);
    return (pems[key.kid] = pem);
  });
  return pems;
}
