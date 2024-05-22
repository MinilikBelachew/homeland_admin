"use client";
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

interface CarOwner {
  id: string;
  name: string;
  address: string;
  password: string;
  phone: string;
  back_id_img: string;
  front_id_img: string;
  backImage: string;
  cars: Car[];
  drivers: Driver[];
}

const CarOwnerPage = () => {
  const [carOwners, setCarOwners] = useState<CarOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCarOwner, setExpandedCarOwner] = useState<string | null>(null);
  const [showCarPopup, setShowCarPopup] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showDriverPopup, setShowDriverPopup] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  useEffect(() => {
    const fetchCarOwners = async () => {
      const carOwnersRef = ref(database, 'car_owners');

      try {
        const snapshot = await get(carOwnersRef);
        if (snapshot.exists()) {
          const carOwnersData: CarOwner[] = Object.entries(snapshot.val()).map(([id, carOwnerData]) => ({
            id,
            name: carOwnerData.name,
            address: carOwnerData.address,
            password: carOwnerData.password,
            phone: carOwnerData.phone,
            back_id_img: carOwnerData.back_id_img,
            front_id_img: carOwnerData.front_id_img,
            backImage: carOwnerData.backImage,
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

  const handleViewCar = (car: Car) => {
    setSelectedCar(car);
    setShowCarPopup(true);
  };

  const handleViewDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDriverPopup(true);
  };

  const closeCarPopup = () => {
    setShowCarPopup(false);
    setSelectedCar(null);
  };

  const closeDriverPopup = () => {
    setShowDriverPopup(false);
    setSelectedDriver(null);
  };

  return (
    <DefaultLayout>
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Car Owners</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">Password</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Back Image</th>
              <th className="py-2 px-4 border-b">Front Image</th>
              <th className="py-2 px-4 border-b">Cars</th>
              <th className="py-2 px-4 border-b">Drivers</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {carOwners.map((carOwner, index) => (
              <React.Fragment key={carOwner.id}>
                <tr>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{carOwner.name}</td>
                  <td className="py-2 px-4 border-b">{carOwner.address}</td>
                  <td className="py-2 px-4 border-b">{carOwner.password}</td>
                  <td className="py-2 px-4 border-b">{carOwner.phone}</td>
                  <td className="py-2 px-4 border-b">
                    <img src={carOwner.backImage} alt="Back Image" className="w-24 h-16 object-cover" />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <img src={carOwner.front_id_img} alt="Front Image" className="w-24 h-16 object-cover" />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => setExpandedCarOwner(prev => prev === carOwner.id ? null : carOwner.id)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">View Cars</button>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => setExpandedCarOwner(prev => prev === carOwner.id ? null : carOwner.id)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">View Drivers</button>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleDeleteCarOwner(carOwner.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded ml-2 transition-colors duration-300">Delete</button>
                  </td>
                </tr>
                {expandedCarOwner === carOwner.id && (
                  <tr>
                    <td colSpan={10}>
                      <div className="flex justify-center mt-4">
                        <div className="w-full max-w-4xl">
                          <h3 className="text-xl font-semibold mb-2">Cars</h3>
                          <ul>
                            {carOwner.cars.map((car, carIndex) => (
                              <li key={car.id}>
                                {carIndex + 1}. {car.make} {car.model} - {car.plateNumber}
                                <button onClick={() => handleViewCar(car)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded ml-2 transition-colors duration-300">View</button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex justify-center mt-4">
                        <div className="w-full max-w-4xl">
                          <h3 className="text-xl font-semibold mb-2">Drivers</h3>
                          <ul>
                            {carOwner.drivers.map((driver, driverIndex) => (
                              <li key={driver.id}>
                                {driverIndex + 1}. {driver.name} - {driver.phone}
                                <button onClick={() => handleViewDriver(driver)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded ml-2 transition-colors duration-300">View</button>
                              </li>
                                                            ))}
                                                            </ul>
                                                          </div>
                                                        </div>
                                                        <div className="flex justify-center mt-4">
                                                          <button onClick={() => setExpandedCarOwner(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded">Close</button>
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  )}
                                  
                                                  {/* Car Popup */}
                                                  {showCarPopup && selectedCar && (
                                                    <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                                                      <div className="bg-white rounded-lg shadow-md p-4 w-1/3">
                                                        <h3 className="text-xl font-semibold mb-2">Car Details</h3>
                                                        <ul>
                                                          <li>Make: {selectedCar.make}</li>
                                                          <li>Model: {selectedCar.model}</li>
                                                          <li>Plate Number: {selectedCar.plateNumber}</li>
                                                          <li>Body Type: {selectedCar.bodyType}</li>
                                                          <li>Color: {selectedCar.color}</li>
                                                          <li>Year: {selectedCar.year}</li>
                                                        </ul>
                                                        <button onClick={closeCarPopup} className="bg-black hover:bg-gray-600 text-white px-2 py-1 rounded mt-2">Close</button>
                                                      </div>
                                                    </div>
                                                  )}
                                  
                                                  {/* Driver Popup */}
                                                  {showDriverPopup && selectedDriver && (
                                                    <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                                                      <div className="bg-white rounded-lg shadow-md p-4 w-1/3">
                                                        <h3 className="text-xl font-semibold mb-2">Driver Details</h3>
                                                        <ul>
                                                          <li>Name: {selectedDriver.name}</li>
                                                          <li>Phone: {selectedDriver.phone}</li>
                                                          <li>Address: {selectedDriver.address}</li>
                                                        </ul>
                                                        <button onClick={closeDriverPopup} className="bg-black hover:bg-gray-600 text-white px-2 py-1 rounded mt-2">Close</button>
                                                      </div>
                                                    </div>
                                                  )}
                                                </React.Fragment>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                      </DefaultLayout>
                                    );
                                  };
                                  
                                  export default CarOwnerPage;
                                  
