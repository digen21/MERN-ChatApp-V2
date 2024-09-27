import React from "react";
import { FaSpinner } from "react-icons/fa";

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <FaSpinner className="animate-spin text-2xl mb-4" />
      <p className="text-lg">{message || "Loading..."}</p>
    </div>
  );
};

export default Loader;
