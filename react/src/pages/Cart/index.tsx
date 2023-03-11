import React from "react";
import { Typography } from "@material-tailwind/react";

function Cart() {
  return (
    <div>
      <div className="mt-5 flex flex-row justify-center">
        <div className="w-[680px] bg-amber-200">
          <Typography variant="45">Cart</Typography>
        </div>
        <div className="w-[350px] bg-amber-700"></div>
      </div>
    </div>
  );
}

export default Cart;
