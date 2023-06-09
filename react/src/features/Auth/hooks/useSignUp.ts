import {useMutation} from "@tanstack/react-query";
import {createUserCustomer} from "../api";

export interface UserCustomer{
    email: string,
    first_name: string,
    last_name: string,
    password: string,
    phone: number,
    address: string
}
const useSignUp = () =>
  useMutation({
    mutationFn: (data: UserCustomer) => createUserCustomer(data)
  });

export default useSignUp;
