"use client"


import { useEffect, useState } from 'react';
import { database } from "../methods/firbase_config";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ref, get, DataSnapshot, update } from "firebase/database";

interface Driver {
  id: string;
  name: string;
  address: string;
  back_id_img: string;
  front_id_img: string;
  earnings: number;
  email: string;
  phoneNumber: string;
  amountToPay: number;
  accountNumber: string;
}

const EarningsPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      const driversRef = ref(database, 'drivers');

      try {
        const snapshot: DataSnapshot = await get(driversRef);
        const driversData: Driver[] = [];

        snapshot.forEach((childSnapshot) => {
          const driverData = childSnapshot.val();
          const earnings = parseFloat(driverData.earnings); // Parse earnings as a number
          const amountToPay = parseFloat(driverData.amountToPay); // Parse amountToPay as a number
          const accountNumber = generateAccountNumber(); // Generate random account number
          driversData.push({
            id: childSnapshot.key as string,
            ...driverData,
            earnings, // Assign parsed earnings
            amountToPay,
            accountNumber,
          });
        });

        console.log("Fetched drivers:", driversData);
        setDrivers(driversData);
        updateDrivers(driversData);
      } catch (error) {
        console.error("Error fetching driver information:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const generateAccountNumber = () => {
    // Generate a random account number (10 digits)
    const min = 1000000000;
    const max = 9999999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const updateDrivers = (driversData: Driver[]) => {
    driversData.forEach(async (driver) => {
      const driverRef = ref(database, `drivers/${driver.id}`);

      try {
        await update(driverRef, {
          amountToPay: driver.amountToPay,
          accountNumber: driver.accountNumber,
        });
      } catch (error) {
        console.error("Error updating driver information:", error);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Driver Earnings</h1>
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full w-full bg-white table-auto">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium">
                <th className="py-2 px-4 border-b">#</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Total Earnings</th>
                <th className="py-2 px-4 border-b">Amount to Pay (5% Deduction)</th>
                <th className="py-2 px-4 border-b">Phone Number</th>
                <th className="py-2 px-4 border-b">Account Number</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver, index) => (
                <tr key={driver.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{driver.name}</td>
                  <td className="py-2 px-4">${driver.earnings.toFixed(2)}</td>
                  <td className="py-2 px-4">${driver.amountToPay.toFixed(2)}</td>
                  <td className="py-2 px-4">{driver.phoneNumber}</td>
                  <td className="py-2 px-4">{driver.accountNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EarningsPage;
