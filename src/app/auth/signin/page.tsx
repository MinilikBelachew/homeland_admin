


"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ref, get, set } from "firebase/database";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AuthLayout from "../authlayout/authLayout";
import { auth, database } from "@/app/methods/firbase_config";

import { signInWithEmailAndPassword } from "firebase/auth";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      document.cookie = `token=${token}; path=/;`;

      // Get the admin's data from the database
      const adminRef = ref(database, `admins/${user.uid}`);
      const adminSnapshot = await get(adminRef);
      if (adminSnapshot.exists()) {
        const adminData = adminSnapshot.val();
        // Update the admin's data with the token
        await set(adminRef, {
          ...adminData,
          token: token,
        });
      }

      console.log(token);
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AuthLayout>
      <Breadcrumb pageName="Log In" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          {/* Your existing UI code */}
          <div className="w-full xl:w-1/2 p-8 sm:p-12">
            <h2 className="text-2xl font-semibold mb-6">Log In</h2>
            <form onSubmit={handleLogin}>
              {/* Email input */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 p-2.5 w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {/* Password input */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 p-2.5 w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* Error message */}
              {error && <p className="text-red-500">{error}</p>}
              {/* Submit button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Log In
                </button>
              </div>
            </form>
            {/* Sign-up link */}
            <div className="mt-6 text-center">
              <Link
                href="/auth/signup"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;

