"use client";

import { database } from "../methods/firbase_config"; // Adjust the import path as needed
import { useEffect, useState } from "react";
import { get, ref, update, remove } from "firebase/database";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface CarDetails {
  bodyType: string;
  carId: string;
  color: string;
  make: string;
  model: string;
  plateNumber: string;
  year: string;
}

interface Driver {
  id: string;
  name: string;
  address: string;
  back_id_img: string;
  front_id_img: string;
  car_details?: CarDetails;
  earnings: string;
  email: string;
  phoneNumber: string;
  history: { [key: string]: boolean };
}

const DriverPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [deleteDriver, setDeleteDriver] = useState<Driver | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      const driversRef = ref(database, "drivers");

      try {
        const snapshot = await get(driversRef);
        if (snapshot.exists()) {
          const driversData: Driver[] = Object.entries(snapshot.val()).map(
            ([id, driver]) => {
              return {
                ...(driver as Driver),
                id, // Assign the id here
                car_details: (driver as Driver).car_details || {}, // Ensure car_details is at least an empty object
              };
            }
          );
          console.log("Fetched drivers:", driversData); // Log the fetched data
          setDrivers(driversData);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching driver information:", error.message);
        } else {
          console.error("Error fetching driver information:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleEditOpen = (driver: Driver) => {
    setEditDriver(driver);
    setOpen(true);
  };

  const handleEditClose = () => {
    setEditDriver(null);
    setOpen(false);
  };

  const handleEditSave = async () => {
    if (editDriver) {
      const driverRef = ref(database, `drivers/${editDriver.id}`);
      await update(driverRef, editDriver);
      setDrivers(
        drivers.map((driver) =>
          driver.id === editDriver.id ? editDriver : driver
        )
      );
      handleEditClose();
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteDriver) {
      const driverRef = ref(database, `drivers/${deleteDriver.id}`);
      await remove(driverRef);
      setDrivers(drivers.filter((driver) => driver.id !== deleteDriver.id));
      setDeleteDriver(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDriver(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editDriver) {
      const { name, value } = e.target;
      if (editDriver.car_details && name in editDriver.car_details) {
        setEditDriver({
          ...editDriver,
          car_details: { ...editDriver.car_details, [name]: value },
        });
      } else {
        setEditDriver({ ...editDriver, [name]: value });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 dark:border-gray-700 h-32 w-32"></div>
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-4">Driver Information</h1>
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full w-full bg-white dark:bg-black table-auto">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left text-sm font-medium dark:text-gray-200">
                <th className="py-2 px-4 border-b dark:border-gray-600"></th>
                <th className="py-2 px-4 border-b dark:border-gray-600">
                  Name
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">
                  Address
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">
                  Email
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">
                  Phone Number
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">
                  Car Details
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">
                  Earnings
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">
                  Front ID Image
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">
                  Back ID Image
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver, index) => (
                <tr
                  key={driver.id}
                  className="border-b hover:bg-gray dark:hover:bg-slate-900 dark:border-gray"
                >
                  <td className="py-2 px-4 whitespace-nowrap dark:text-gray">
                    {index + 1}
                  </td>{" "}
                  {/* Added client-side numbering */}
                  <td className="py-2 px-4 dark:text-gray-200">
                    {driver.name}
                  </td>
                  <td className="py-2 px-4 dark:text-gray-200">
                    {driver.address}
                  </td>
                  <td className="py-2 px-4 dark:text-gray-200">
                    {driver.email}
                  </td>
                  <td className="py-2 px-4 dark:text-gray-200">
                    {driver.phoneNumber}
                  </td>
                  <td className="py-2 px-4 dark:text-gray-200">
                    {driver.car_details ? (
                      <div>
                        <p>{driver.car_details.bodyType}</p>
                        {/* <p>{driver.car_details.make} {driver.car_details.model}</p> */}
                        <p>
                          {driver.car_details.plateNumber} (
                          {driver.car_details.year})
                        </p>
                      </div>
                    ) : (
                      "No car details available"
                    )}
                  </td>
                  <td className="py-2 px-4 dark:text-gray">
                    {driver.earnings}
                  </td>
                  <td className="py-2 px-4">
                    <img
                      className="w-16 h-16 object-cover"
                      src={driver.front_id_img}
                      alt="Front ID"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <img
                      className="w-16 h-16 object-cover"
                      src={driver.back_id_img}
                      alt="Back ID"
                    />
                  </td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={() => handleEditOpen(driver)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteDriver(driver)}
                      className="bg-red text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editDriver && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray dark:text-white p-4 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Edit Driver</h2>
              <input
                className="border p-2 w-full mb-4 dark:bg-gray dark:text-white"
                type="text"
                name="name"
                value={editDriver.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                className="border p-2 w-full mb-4 dark:bg-gray dark:text-white"
                type="text"
                name="address"
                value={editDriver.address}
                onChange={handleChange}
                placeholder="Address"
              />
              <input
                className="border p-2 w-full mb-4 dark:bg-gray dark:text-white"
                type="email"
                name="email"
                value={editDriver.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                className="border p-2 w-full mb-4 dark:bg-gray dark:text-white"
                type="text"
                name="phoneNumber"
                value={editDriver.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
              />
              <input
                className="border p-2 w-full mb-4 dark:bg-gray dark:text-white"
                type="text"
                name="earnings"
                value={editDriver.earnings}
                onChange={handleChange}
                placeholder="Earnings"
              />
              {editDriver.car_details && (
                <>
                  <input
                    className="border p-2 w-full mb-4 dark:bg-gray dark:text-white"
                    type="text"
                    name="bodyType"
                    value={editDriver.car_details.bodyType}
                    onChange={handleChange}
                    placeholder="Car Body Type"
                  />
                  <input
                    className="border p-2 w-full mb-4 dark:bg-gray dark:text-white"
                    type="text"
                    name="make"
                    value={editDriver.car_details.make}
                    onChange={handleChange}
                    placeholder="Car Make"
                  />
                  <input
                    className="border p-2 w-full mb-4 dark:bg-gray-700 dark:text-white"
                    type="text"
                    name="model"
                    value={editDriver.car_details.model}
                    onChange={handleChange}
                    placeholder="Car Model"
                  />
                  <input
                    className="border p-2 w-full mb-4 dark:bg-gray-700 dark:text-white"
                    type="text"
                    name="plateNumber"
                    value={editDriver.car_details.plateNumber}
                    onChange={handleChange}
                    placeholder="Car Plate Number"
                  />
                  <input
                    className="border p-2 w-full mb-4 dark:bg-gray-700 dark:text-white"
                    type="text"
                    name="year"
                    value={editDriver.car_details.year}
                    onChange={handleChange}
                    placeholder="Car Year"
                  />
                </>
              )}
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleEditSave}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleEditClose}
                  className="bg-blue-900 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteDriver && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete {deleteDriver.name}?</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={handleDeleteCancel}
                  className="bg-blue-900 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default DriverPage;
