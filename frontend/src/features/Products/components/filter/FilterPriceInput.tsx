import { Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

interface Props {
  placeholder: string;
  value: string | null;
  onChange: (value: number | null) => void;
}

function FilterPriceInput({ value: _value, placeholder, onChange }: Props) {
  const [value, setValue] = useState("");

  const handleChange = (rawValue: string) => {
    const value = parseInt(rawValue);
    if (!isNaN(value)) {
      setValue(value.toString());
      onChange(value);
    } else if (rawValue === "") {
      setValue("");
      onChange(null);
    }
  };

  useEffect(() => {
    if (_value) handleChange(_value);
  }, [_value]);

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
        onChange={(e) => handleChange(e.target.value)}
        value={value}
      />
    </div>
  );
}

export default FilterPriceInput;
