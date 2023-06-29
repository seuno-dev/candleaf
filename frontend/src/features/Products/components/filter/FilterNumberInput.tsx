import { Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

interface Props {
  placeholder: string;
  value: string | null;
  onChange: (value: number | null) => void;
}

function FilterNumberInput({ value: _value, placeholder, onChange }: Props) {
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
    <div className="w-full flex flex-row items-center">
      <Input
        placeholder={placeholder}
        className="!border-t-blue-gray-200 focus:!border-t-blue-500"
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

export default FilterNumberInput;
