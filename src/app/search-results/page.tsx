"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

interface CarDetails {
  bodyType: string;
  color: string;
  make: string;
  model: string;
  plateNumber: string;
  year: string;
}

interface SearchResult {
  id: string;
  car_details?: CarDetails;
  created_at: string;
  driver_id: string;
  driver_name: string;
  driver_phone: string;
  driver_location: { latitude: string; longitude: string };
  dropoff: { latitude: string; longitude: string };
  dropoff_address: string;
  fares: string;
  package_description: string;
  payment_method: string;
  pickup: { latitude: string; longitude: string };
  pickup_address: string;
  rider_name: string;
  rider_phone: string;
  status: string;
  user?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    backImage: string;
    frontImage: string;
  };
}

const SearchResultst = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedResults = localStorage.getItem('searchResults');
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      setSearchResults(parsedResults);
      setFilteredResults(parsedResults);
    }
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchQuery, searchResults]);

  const filterResults = () => {
    let results = [...searchResults];
    if (searchQuery) {
      results = results.filter(item =>
        item.driver_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredResults(results);
  };

  const clearResults = () => {
    setSearchResults([]);
    setFilteredResults([]);
    localStorage.removeItem('searchResults');
  };

  const goBack = () => {
    router.back();
  };

  if (filteredResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          onClick={goBack}
        >
          Go Back
        </button>
      </div>
    );
  }
  
  

  return (
    <div className="container mx-auto mt-8">
      <h1 className="mb-4 text-2xl font-semibold">Search Results</h1>
      <button
        onClick={clearResults}
        className="mb-4 px-4 py-2 text-white bg-red rounded hover:bg-red-600"
      >
        Clear Results
      </button>
      <div className="grid grid-cols-1 gap-4">
        {filteredResults.map((item, index) => (
          <div key={index} className="border p-4">
            <h2 className="text-xl font-semibold mb-2">Search Result {index + 1}</h2>
            <p><strong>Driver Name:</strong> {item.driver_name}</p>
            <p><strong>Rider Name:</strong> {item.rider_name}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Fares:</strong> {item.fares}</p>
            <p><strong>Package Description:</strong> {item.package_description}</p>
            {item.car_details && (
              <div>
                <p><strong>Car Details:</strong></p>
                <p><strong>Body Type:</strong> {item.car_details.bodyType}</p>
                <p><strong>Color:</strong> {item.car_details.color}</p>
                <p><strong>Make:</strong> {item.car_details.make}</p>
                <p><strong>Model:</strong> {item.car_details.model}</p>
                <p><strong>Plate Number:</strong> {item.car_details.plateNumber}</p>
                <p><strong>Year:</strong> {item.car_details.year}</p>
              </div>
            )}
            <p><strong>Created At:</strong> {item.created_at}</p>
            <p><strong>Driver Phone:</strong> {item.driver_phone}</p>
            <p><strong>Dropoff Address:</strong> {item.dropoff_address}</p>
            <p><strong>Payment Method:</strong> {item.payment_method}</p>
            <p><strong>Pickup Address:</strong> {item.pickup_address}</p>
            {item.user && (
              <div>
                <p><strong>User Name:</strong> {item.user.name}</p>
                <p><strong>User Email:</strong> {item.user.email}</p>
                <p><strong>User Phone:</strong> {item.user.phone}</p>
                <p><strong>User Address:</strong> {item.user.address}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};



export default SearchResultst;
