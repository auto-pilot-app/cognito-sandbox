import { api } from "@utils";

export async function getUser() {
  const { data } = await api.get("/users");
  return data.payload;
}
