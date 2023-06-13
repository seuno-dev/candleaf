import React, {useState} from "react";
import {Button, Input} from "@material-tailwind/react";
import {OrderTimeFilter} from "../types";

interface Props{
  dateFilter: OrderTimeFilter
  handleSubmit: (dateMin:string, dateMax:string) => void,
}
const OrderFilter = ({dateFilter:orderTime, handleSubmit}:Props) => {
  const [dateFilter, setDateFilter] = useState({
    orderTimeMin:"",
    orderTimeMax:""
  });
  const handleDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter({...dateFilter, [e.target.id]: e.target.value});
  };
  return (
    <div className="mb-3">
      <div className="grid grid-cols-7 gap-5">
        <div className="col-span-3">
          <Input id="orderTimeMin" type="date" label="Date from" value={dateFilter.orderTimeMin||orderTime.orderTimeMin} onChange={handleDateFilter}/>
        </div>
        <div className="col-span-3">
          <Input id="orderTimeMax" type="date" label="Date to" value={dateFilter.orderTimeMax||orderTime.orderTimeMax}  onChange={handleDateFilter}/>
        </div>
        <Button variant="outlined" color="light-green" onClick={()=>handleSubmit(dateFilter.orderTimeMin, dateFilter.orderTimeMax)}>Filter</Button>
      </div>
    </div>
  );
};
export default OrderFilter;
