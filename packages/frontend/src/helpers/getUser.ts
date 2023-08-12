import { api } from "@utils";

/**
 * Stub function to return the authenticated cognito user
 * @returns cognito user
 */
export async function getUser() {
  const { data } = await api.get("/users");
  return data.payload;
}
