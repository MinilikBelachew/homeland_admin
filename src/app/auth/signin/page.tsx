// Login.tsx
"use client"
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // New state for loading

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login process starts
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      document.cookie = `token=${token}; path=/;`;

      const adminRef = ref(database, `admins/${user.uid}`);
      const adminSnapshot = await get(adminRef);
      if (adminSnapshot.exists()) {
        const adminData = adminSnapshot.val();
        await set(adminRef, {
          ...adminData,
          token: token,
        });
      }

      console.log(token);
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        setError("Please Try Again");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false); // Set loading back to false when login process finishes
    }
  };

  return (
    <AuthLayout>
      <Breadcrumb pageName="Log In" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-full p-8 sm:p-12">
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
                  className="mt-1 p-2.5 w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 dark:border-gray-600 dark:bg-black dark:text-white dark:focus:ring-blue-500"
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
                  className="mt-1 p-2.5 w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 dark:border-gray-600 dark:bg-black dark:text-white dark:focus:ring-blue-500"
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
                  disabled={loading} // Disable button when loading
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full"></div>
                      Logging In...
                    </div>
                  ) : (
                    "Log In"
                  )}{" "}
                  {/* Show spinner or text based on loading state */}
                </button>
              </div>
            </form>
            {/* Sign-up link */}
            {/* Your existing code */}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
