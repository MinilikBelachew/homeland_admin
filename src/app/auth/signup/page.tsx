"use client"
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { getIdToken } from "firebase/auth";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AuthLayout from "../authlayout/authLayout";
import { auth, database } from "@/app/methods/firbase_config";

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [retypePassword, setRetypePassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== retypePassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user data in Realtime Database
      await set(ref(database, 'admins/' + user.uid), {
        name: name,
        email: email,
        phoneNumber: phoneNumber
      });

      // Get ID token for the user
      const token = await getIdToken(user);

      // Store token under admins collection
      await set(ref(database, 'admins/' + user.uid + '/token'), token);

      // Redirect to home page after sign-up
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <AuthLayout>
      <Breadcrumb pageName="Sign Up" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <Link href="/">
                <Image className="hidden dark:block" src={"/images/logo/logo.svg"} alt="Logo" width={176} height={32} />
                <Image className="dark:hidden" src={"/images/logo/logo-dark.svg"} alt="Logo" width={176} height={32} />
              </Link>
              <p className="2xl:px-20">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit suspendisse.
              </p>
              <span className="mt-15 inline-block">
                {/* SVG Illustration */}
              </span>
            </div>
          </div>

          <div className="w-full xl:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSignUp}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Retype Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded"
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Sign Up
              </button>
            </form>
            <p className="mt-4">
              Already have an account? <Link href="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
