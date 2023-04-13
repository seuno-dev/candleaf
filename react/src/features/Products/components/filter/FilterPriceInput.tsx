import { Input } from "@material-tailwind/react";
import React, { useState } from "react";

interface Props {
  placeholder: string;
  onChange: (value: number | null) => void;
}

function FilterPriceInput({ placeholder, onChange }: Props) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const value = parseInt(rawValue);
    if (!isNaN(value)) {
      setValue(value.toString());
      onChange(value);
    } else if (rawValue === "") {
      setValue("");
      onChange(null);
    }
  };

  return (
    <div className="w-full max-w-[16rem] flex flex-row items-center">
      <div
        className="flex justify-center items-center w-10 h-10 border border-r-0 border-blue-gray-200
        bg-blue-gray-500/10 text-blue-gray-500 font-bold rounded-l-lg"
      >
        $
      </div>
      <Input
        placeholder={placeholder}
        className="rounded-l-none !border-t-blue-gray-200 focus:!border-t-blue-500"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        containerProps={{
          className: "h-10",
        }}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
}

export default FilterPriceInput;
