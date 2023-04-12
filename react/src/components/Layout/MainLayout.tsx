import React from "react";
import Navbar from "../Elements/Navbar";

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <div className="w-full">
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
