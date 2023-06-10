import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Profile } from "../types";
import { updateProfile } from "../api";

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<Profile, Error, Profile, Profile | undefined>({
    mutationFn: (newProfile: Profile) => updateProfile(newProfile),
    onMutate: (newProfile) => {
      const prevProfile = queryClient.getQueryData<Profile>(["profile"]);

      queryClient.setQueryData(["profile"], newProfile);

      return prevProfile;
    },
    onError: (error, newProfile, context) => {
      if (!context) return;
      queryClient.setQueryData(["profile"], context);
    },
  });
};

export default useUpdateProfile;
