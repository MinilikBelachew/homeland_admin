"use client";
import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../methods/firbase_config";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import "tailwindcss/tailwind.css";

interface RideRequest {
  id: string;
  car_details: string;
  created_at: string;
  driver_id: string;
  driver_location: {
    latitude: string;
    longitude: string;
  };
  driver_name: string;
  driver_phone: string;
  dropoff: {
    latitude: string;
    longitude: string;
  };
  dropoff_address: string;
  fares: string;
  package_description: string;
  payment_method: string;
  pickup: {
    latitude: string;
    longitude: string;
  };
  pickup_address: string;
  rider_name: string;
  rider_phone: string;
  status: string;
}

const RideRequestsPage = () => {
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState<RideRequest | null>(null);

  useEffect(() => {
    const fetchRideRequests = async () => {
      const rideRequestsRef = ref(database, "Ride Request");
      try {
        const snapshot = await get(rideRequestsRef);
        if (snapshot.exists()) {
          const rideRequestsData: RideRequest[] = Object.entries(
            snapshot.val()
          ).map(([id, rideRequestData]) => ({
            id,
            ...(rideRequestData as Omit<RideRequest, "id">),
          }));
          setRideRequests(rideRequestsData);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching ride requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRideRequests();
  }, []);

  const handleViewDetails = (rideRequest: RideRequest) => {
    setSelectedRide(rideRequest);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRide(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-center">Ride Requests</h2>
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-500 text-black dark:bg-black dark:text-gray">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Rider Name</th>
                <th className="py-3 px-6 text-left">Driver Name</th>
                <th className="py-3 px-6 text-left">Pickup Address</th>
                <th className="py-3 px-6 text-left">Dropoff Address</th>
                <th className="py-3 px-6 text-left">Car Details</th>
                <th className="py-3 px-6 text-left">Fares</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rideRequests.map((rideRequest, index) => (
                <tr
                  key={rideRequest.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td className="py-4 px-6 text-left">{index + 1}</td>
                  <td className="py-4 px-6 text-left">
                    {rideRequest.rider_name}
                  </td>
                  <td className="py-4 px-6 text-left">
                    {rideRequest.driver_name}
                  </td>
                  <td className="py-4 px-6 text-left">
                    {rideRequest.pickup_address}
                  </td>
                  <td className="py-4 px-6 text-left">
                    {rideRequest.dropoff_address}
                  </td>
                  <td className="py-4 px-6 text-left">
                    {rideRequest.car_details}
                  </td>
                  <td className="py-4 px-6 text-left">{rideRequest.fares}</td>
                  <td className="py-4 px-6 text-left">
                    <span
                      className={`py-1 px-3 rounded-full text-black ${
                        rideRequest.status === "ended"
                          ? "bg-green-500 dark:bg-green-600"
                          : "bg-red-500 dark:bg-red-600"
                      }`}
                    >
                      {rideRequest.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-300"
                      onClick={() => handleViewDetails(rideRequest)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && selectedRide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-lg max-w-lg mx-auto p-6 relative">
              <h3 className="text-2xl font-bold mb-4">Ride Details</h3>
              <div className="space-y-2">
                <p>
                  <strong>Rider Name:</strong> {selectedRide.rider_name}
                </p>
                <p>
                  <strong>Rider Phone:</strong> {selectedRide.rider_phone}
                </p>
                <p>
                  <strong>Driver Name:</strong> {selectedRide.driver_name}
                </p>
                <p>
                  <strong>Driver Phone:</strong> {selectedRide.driver_phone}
                </p>
                <p>
                  <strong>Pickup Address:</strong> {selectedRide.pickup_address}
                </p>
                <p>
                  <strong>Dropoff Address:</strong>{" "}
                  {selectedRide.dropoff_address}
                </p>
                <p>
                  <strong>Car Details:</strong> {selectedRide.car_details}
                </p>
                <p>
                  <strong>Fares:</strong> {selectedRide.fares}
                </p>
                <p>
                  <strong>Package Description:</strong>{" "}
                  {selectedRide.package_description}
                </p>
                <p>
                  <strong>Payment Method:</strong> {selectedRide.payment_method}
                </p>
                <p>
                  <strong>Status:</strong> {selectedRide.status}
                </p>
              </div>
              <button
                className="absolute top-2 right-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-3 py-1 rounded"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default RideRequestsPage;
