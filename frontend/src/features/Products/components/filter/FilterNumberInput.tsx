import React, { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";

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
    <Input
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export default FilterNumberInput;
