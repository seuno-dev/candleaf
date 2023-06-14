import {useQuery} from "@tanstack/react-query";
import {retrieveOrderList} from "../api";
import {OrderTimeFilter} from "../types";

const useOrderList = (params:OrderTimeFilter) =>
  useQuery({
    queryKey: ["orders", params.orderTimeMin, params.orderTimeMax],
    queryFn: () => retrieveOrderList(params)
  });

export default useOrderList;
