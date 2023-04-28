import { client } from "../../../api";
import { Profile } from "../types";

export const retrieveProfile = () =>
  client.get<Profile>("/store/customers/me/").then((res) => res.data);
