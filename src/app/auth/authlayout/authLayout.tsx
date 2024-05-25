// AuthLayout.tsx
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl bg-white dark:bg-black p-6 rounded-md shadow-md">
        {children}
      </div>
    </div>
  );
}
