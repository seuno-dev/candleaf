import { client } from "../../../api";
import { Profile } from "../types";
import { decamelizeKeys } from "humps";

export const retrieveProfile = () =>
  client.get<Profile>("/store/customers/me/").then((res) => res.data);

export const updateProfile = (newProfile: Profile) =>
  client
    .put<Profile>("/store/customers/me/", decamelizeKeys(newProfile))
    .then((res) => res.data);
