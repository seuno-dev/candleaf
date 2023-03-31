import React, { useState } from "react";

type SearchBarProps = {
  onSearchSubmit: (input: string) => void;
};

function SearchBar({ onSearchSubmit }: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchSubmit(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <input
      className="w-full py-1 px-3 rounded-lg focus:outline-none text-black"
      type="text"
      placeholder="Find products"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      value={value}
    />
  );
}

export default SearchBar;
