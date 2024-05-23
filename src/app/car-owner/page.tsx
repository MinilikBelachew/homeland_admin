'use client';

import React, { useEffect, useState } from 'react';
import { get, ref, remove } from 'firebase/database';
import { database } from '../methods/firbase_config'; // Adjust the import path as needed
import DefaultLayout from '@/components/Layouts/DefaultLayout';

interface Car {
  id: string;
  bodyType: string;
  color: string;
  make: string;
  model: string;
  plateNumber: string;
  year: string;
  driverId: string;
}

interface Driver {
  id: string;
  name: string;
  address: string;
  password: string;
  phone: string;
  back_id_img: string;
  front_id_img: string;
  carId: string;
}

interface CarOwnerData {
  name: string;
  address: string;
  password: string;
  phone: string;
  backImage: string;
  frontImage: string;
  cars?: {
    [carId: string]: {
      bodyType: string;
      color: string;
      make: string;
      model: string;
      plateNumber: string;
      year: string;
      driverId: string;
    };
  };
  drivers?: {
    [driverId: string]: {
      name: string;
      address: string;
      password: string;
      phone: string;
      back_id_img: string;
      front_id_img: string;
      carId: string;
    };
  };
}

interface CarOwner {
  id: string;
  name: string;
  address: string;
  password: string;
  phone: string;
  backImage: string;
  frontImage: string;
  cars: Car[];
  drivers: Driver[];
}

const CarOwnerPage = () => {
  const [carOwners, setCarOwners] = useState<CarOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCarPopup, setShowCarPopup] = useState(false);
  const [selectedCars, setSelectedCars] = useState<(Car & { driverName: string })[]>([]);
  const [showDriverPopup, setShowDriverPopup] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState<(Driver & { carAttributes: string })[]>([]);

  useEffect(() => {
    const fetchCarOwners = async () => {
      const carOwnersRef = ref(database, 'car_owners');

      try {
        const snapshot = await get(carOwnersRef);
        if (snapshot.exists()) {
          const carOwnersData: CarOwner[] = Object.entries(snapshot.val() as { [key: string]: CarOwnerData }).map(([id, carOwnerData]) => ({
            id,
            name: carOwnerData.name,
            address: carOwnerData.address,
            password: carOwnerData.password,
            phone: carOwnerData.phone,
            backImage: carOwnerData.backImage,
            frontImage: carOwnerData.frontImage,
            cars: carOwnerData.cars ? Object.entries(carOwnerData.cars).map(([carId, car]) => ({ id: carId, ...car })) : [],
            drivers: carOwnerData.drivers ? Object.entries(carOwnerData.drivers).map(([driverId, driver]) => ({ id: driverId, ...driver })) : []
          }));
          setCarOwners(carOwnersData);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching car owners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarOwners();
  }, []);

  const handleDeleteCarOwner = async (carOwnerId: string) => {
    const carOwnerRef = ref(database, `car_owners/${carOwnerId}`);
    await remove(carOwnerRef);
    setCarOwners(carOwners.filter(carOwner => carOwner.id !== carOwnerId));
  };

  const handleDeleteCar = async (carOwnerId: string, carId: string) => {
    const carRef = ref(database, `car_owners/${carOwnerId}/cars/${carId}`);
    await remove(carRef);
    setCarOwners(carOwners.map(carOwner => {
      if (carOwner.id === carOwnerId) {
        return { ...carOwner, cars: carOwner.cars.filter(car => car.id !== carId) };
      }
      return carOwner;
    }));
  };

  const handleDeleteDriver = async (carOwnerId: string, driverId: string) => {
    const driverRef = ref(database, `car_owners/${carOwnerId}/drivers/${driverId}`);
    await remove(driverRef);
    setCarOwners(carOwners.map(carOwner => {
      if (carOwner.id === carOwnerId) {
        return { ...carOwner, drivers: carOwner.drivers.filter(driver => driver.id !== driverId) };
      }
      return carOwner;
    }));
  };

  const handleViewCars = (cars: Car[], drivers: Driver[]) => {
    const carsWithDriverNames = cars.map(car => {
      const driver = drivers.find(driver => driver.id === car.driverId);
      return { ...car, driverName: driver ? driver.name : 'No driver assigned' };
    });
    setSelectedCars(carsWithDriverNames);
    setShowCarPopup(true);
  };

  const handleViewDrivers = (drivers: Driver[], cars: Car[]) => {
    const driversWithCarAttributes = drivers.map(driver => {
      const car = cars.find(car => car.id === driver.carId);
      const carAttributes = car ? `Make: ${car.make}, Model: ${car.model}, Plate Number: ${car.plateNumber}` : 'No car assigned';
      return { ...driver, carAttributes };
    });
    setSelectedDrivers(driversWithCarAttributes);
    setShowDriverPopup(true);
  };

  const closeCarPopup = () => {
    setShowCarPopup(false);
    setSelectedCars([]);
  };

  const closeDriverPopup = () => {
    setShowDriverPopup(false);
    setSelectedDrivers([]);
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8 dark:bg-black dark:text-white">
        <h2 className="text-2xl font-bold mb-4">Car Owners</h2>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr className=" bg-slate-300 dark:bg-slate-900">
                <th className="py-2 px-4 border-b dark:border-gray-600">#</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Name</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Address</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Password</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Phone</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Back Image</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Front Image</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Cars</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Drivers</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {carOwners.map((carOwner, index) => (
                <React.Fragment key={carOwner.id}>
                  <tr className="hover:bg-slate-400 dark:bg-black">
                    <td className="py-2 px-4 border-b dark:border-gray-600">{index + 1}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{carOwner.name}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{carOwner.address}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{carOwner.password}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{carOwner.phone}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      <img src={carOwner.backImage} alt="Back Image" className="w-24 h-16 object-cover" />
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      <img src={carOwner.frontImage} alt="Front Image" className="w-24 h-16 object-cover" />
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      <button onClick={() => handleViewCars(carOwner.cars, carOwner.drivers)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">View Cars</button>
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      <button onClick={() => handleViewDrivers(carOwner.drivers, carOwner.cars)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">View Drivers</button>
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      <button onClick={() => handleDeleteCarOwner(carOwner.id)} className=" bg-red hover:bg-red text-white px-2 py-1 rounded ml-2 transition-colors duration-300">Delete</button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Car Popup */}
      {showCarPopup && (
        <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white dark:bg-black rounded-lg shadow-md p-4 w-1/3">
            <h3 className="text-xl font-semibold mb-2">Cars Details</h3>
            <ul>
              {selectedCars.map((car, index) => (
                <li key={car.id}>
                  {index + 1}. {car.make} {car.model} - {car.plateNumber} (Driver: {car.driverName})
                </li>
              ))}
            </ul>
            <button onClick={closeCarPopup} className="bg-black hover:bg-gray-600 text-white px-2 py-1 rounded mt-2">Close</button>
          </div>
        </div>
      )}

      {/* Driver Popup */}
      {showDriverPopup && (
        <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white dark:bg-black rounded-lg shadow-md p-4 w-1/3">
            <h3 className="text-xl font-semibold mb-2">Drivers Details</h3>
            <ul>
              {selectedDrivers.map((driver, index) => (
                <li key={driver.id}>
                  {index + 1}. {driver.name} - {driver.phone} (Car: {driver.carAttributes})
                </li>
              ))}
            </ul>
            <button onClick={closeDriverPopup} className="bg-black hover:bg-gray-600 text-white px-2 py-1 rounded mt-2">Close</button>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default CarOwnerPage;
