import { useQuery } from "@tanstack/react-query";
import { retrieveProfile } from "../api";

const useRetrieveProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: retrieveProfile,
  });

export default useRetrieveProfile;
