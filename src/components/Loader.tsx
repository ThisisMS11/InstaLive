import { Loader } from 'lucide-react';
import React from 'react';

const LoaderComponent: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="dark:bg-black flex h-[100vh] fixed top-0 w-full bg-white opacity-60 items-center justify-center gap-2">
      <Loader className="animate-spin" />
      <span className="text-sm font-semibold ">{message}</span>
    </div>
  );
};

export default LoaderComponent;
