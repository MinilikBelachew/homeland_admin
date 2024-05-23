"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { auth } from "@/app/methods/firbase_config"; // Correct the import path if needed
import SignIn from "../../app/auth/signin/page";
import { jwtDecode } from "jwt-decode"; // Ensure this import is correct

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshToken = async () => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      document.cookie = `token=${token}; path=/;`;
    }
  };

  useEffect(() => {
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const token = getCookie("token");
    console.log("Token from cookie:", token); // Debugging line
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Debugging line
        const currentTime = Date.now() / 1000;
        console.log(currentTime);
        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/auth/signin");
        }
      } catch (error) {
        console.error("Invalid token", error);
        setIsAuthenticated(false);
        router.push("/auth/signin");
      }
    } else {
      setIsAuthenticated(false);
      router.push("/auth/signin");
    }

    setLoading(false);

    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 15 * 60 * 10);

    return () => clearInterval(refreshInterval);
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <p>You will be redirected to the login page...</p>
        <SignIn />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
