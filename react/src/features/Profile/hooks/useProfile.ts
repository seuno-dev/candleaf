import { useQuery } from "@tanstack/react-query";
import { retrieveProfile } from "../api";

const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: retrieveProfile,
  });

export default useProfile;
